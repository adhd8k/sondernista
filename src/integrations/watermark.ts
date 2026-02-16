/**
 * Astro integration: Watermark processed images after build.
 * 
 * Hooks into astro:build:done to stamp the signature onto all
 * optimised images in the _astro output directory. This way
 * source images stay clean and only the built output is watermarked.
 * 
 * Usage in astro.config.mjs:
 *   import watermark from './src/integrations/watermark'
 *   integrations: [watermark({ opacity: 0.15, scale: 0.08 })]
 */
import type { AstroIntegration } from 'astro'
import { readdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

interface WatermarkConfig {
  /** Path to watermark PNG relative to project root */
  watermarkPath: string
  /** Watermark width as fraction of image width (0.0 - 1.0) */
  scale: number
  /** Watermark opacity (0.0 - 1.0) */
  opacity: number
  /** Padding from edge in pixels */
  padding: number
  /** Position on the image */
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  /** Minimum image width to watermark (skip thumbnails) */
  minWidth: number
  /** File extensions to process */
  extensions: string[]
  /** Stroke border width in pixels (scaled with watermark). Creates contrast outline. */
  borderWidth: number
  /** Border color */
  borderColor: { r: number; g: number; b: number }
  /** Fill color for the signature strokes */
  fillColor: { r: number; g: number; b: number }
}

const DEFAULT_CONFIG: WatermarkConfig = {
  watermarkPath: 'src/assets/images/signature.png',
  scale: 0.10,
  opacity: 0.4,
  padding: 20,
  position: 'bottom-right',
  minWidth: 400,
  extensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
  borderWidth: 3,
  borderColor: { r: 0, g: 0, b: 0 },
  fillColor: { r: 255, g: 255, b: 255 },
}

async function findImages(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...await findImages(fullPath, extensions))
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        if (extensions.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  } catch {
    // Directory doesn't exist, that's fine
  }
  return files
}

async function prepareWatermark(
  watermarkBuffer: Buffer,
  targetWidth: number,
  config: WatermarkConfig
): Promise<{ buffer: Buffer; width: number; height: number }> {
  const wmWidth = Math.round(targetWidth * config.scale)
  const border = config.borderWidth

  // Resize the source signature (black on transparent)
  const resizedBuf = await sharp(watermarkBuffer)
    .resize(wmWidth)
    .ensureAlpha()
    .png()
    .toBuffer()

  const resizedMeta = await sharp(resizedBuf).metadata()
  const w = resizedMeta.width!
  const h = resizedMeta.height!

  // Extract the alpha channel as a mask of where strokes are
  const alphaBuf = await sharp(resizedBuf)
    .extractChannel(3)
    .toBuffer()

  // Create a dilated (expanded) version for the border/outline
  // We do multiple passes of median filter to thicken the mask
  let dilated = alphaBuf
  for (let i = 0; i < border; i++) {
    dilated = await sharp(dilated, { raw: { width: w, height: h, channels: 1 } })
      .median(3)
      .toBuffer()
  }

  // Threshold the dilated mask to make it crisp
  dilated = await sharp(dilated, { raw: { width: w, height: h, channels: 1 } })
    .threshold(20)
    .toBuffer()

  // Create border layer: borderColor where dilated mask is, transparent elsewhere
  const { r: br, g: bg, b: bb } = config.borderColor
  const borderLayer = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: br, g: bg, b: bb, alpha: 1 } }
  })
    .composite([{
      input: dilated,
      raw: { width: w, height: h, channels: 1 },
      blend: 'dest-in',
    }])
    .png()
    .toBuffer()

  // Create fill layer: fillColor where original alpha is, transparent elsewhere
  const { r: fr, g: fg, b: fb } = config.fillColor
  const fillLayer = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: fr, g: fg, b: fb, alpha: 1 } }
  })
    .composite([{
      input: alphaBuf,
      raw: { width: w, height: h, channels: 1 },
      blend: 'dest-in',
    }])
    .png()
    .toBuffer()

  // Combine: border layer on bottom, fill layer on top
  const combined = await sharp(borderLayer)
    .composite([{ input: fillLayer }])
    .png()
    .toBuffer()

  // Apply overall opacity
  const buffer = await sharp(combined)
    .ensureAlpha()
    .composite([{
      input: Buffer.from([255, 255, 255, Math.round(255 * config.opacity)]),
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in',
    }])
    .png()
    .toBuffer()

  return { buffer, width: w, height: h }
}

export default function watermarkIntegration(userConfig?: Partial<WatermarkConfig>): AstroIntegration {
  const config = { ...DEFAULT_CONFIG, ...userConfig }

  return {
    name: 'sondernista-watermark',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const projectRoot = process.cwd()
        const watermarkPath = join(projectRoot, config.watermarkPath)
        const outputDir = dir.pathname // Astro's dist directory

        // Load watermark
        let watermarkBuffer: Buffer
        try {
          watermarkBuffer = await sharp(watermarkPath).png().toBuffer()
        } catch {
          logger.warn(`Watermark not found: ${config.watermarkPath} — skipping`)
          return
        }

        // Find all built images (Astro puts optimised images in _astro/)
        const astroAssetsDir = join(outputDir, '_astro')
        const images = await findImages(astroAssetsDir, config.extensions)

        if (images.length === 0) {
          logger.info('No images to watermark in build output')
          return
        }

        logger.info(`Watermarking ${images.length} images...`)

        let processed = 0
        let skipped = 0
        let errors = 0

        for (const imagePath of images) {
          try {
            const image = sharp(imagePath)
            const metadata = await image.metadata()

            if (!metadata.width || !metadata.height || metadata.width < config.minWidth) {
              skipped++
              continue
            }

            // Prepare watermark scaled to this image
            const wm = await prepareWatermark(
              watermarkBuffer,
              metadata.width,
              config
            )

            // Calculate position
            let top: number, left: number
            switch (config.position) {
              case 'bottom-right':
                top = metadata.height - wm.height - config.padding
                left = metadata.width - wm.width - config.padding
                break
              case 'bottom-left':
                top = metadata.height - wm.height - config.padding
                left = config.padding
                break
              case 'top-right':
                top = config.padding
                left = metadata.width - wm.width - config.padding
                break
              case 'top-left':
                top = config.padding
                left = config.padding
                break
            }

            // Composite watermark onto image
            const format = extname(imagePath).slice(1) as keyof sharp.FormatEnum
            const result = await image
              .composite([{
                input: wm.buffer,
                top: Math.max(0, top),
                left: Math.max(0, left),
              }])
              .toBuffer()

            // Write back in the same format
            await sharp(result).toFile(imagePath)
            processed++
          } catch (err) {
            errors++
            logger.warn(`Failed: ${imagePath} — ${err}`)
          }
        }

        logger.info(
          `✓ Watermarked ${processed} images` +
          (skipped ? `, skipped ${skipped} (too small)` : '') +
          (errors ? `, ${errors} errors` : '')
        )
      },
    },
  }
}
