#!/usr/bin/env node
// Mirror src/assets/original-images/ (full-resolution archive, gitignored) into
// src/assets/images/ (web-sized derivatives, committed) so the site can be built
// from a plain checkout on GitHub Actions.
//
//   npm run images            build missing / stale derivatives
//   npm run images -- --force rebuild everything (after changing LONG_EDGE or QUALITY)
//   npm run images -- --prune also delete derivatives whose original is gone
//
// Rules:
//   - The tree is mirrored one-to-one: work/<dir>/<file> stays work/<dir>/<file>,
//     so `img()` / `galleryFrom()` keys in src/data/projects.ts do not change.
//   - Raster images are resized so the long edge is at most LONG_EDGE px and
//     re-encoded (JPEG via mozjpeg, PNG lossless). EXIF, ICC and GPS are stripped
//     and pixels are converted to sRGB; orientation is baked in first.
//   - SVGs are copied as-is. Dotfiles, dot-directories (.AppleDouble …) and
//     anything that is not an image (.pp3 sidecars …) are ignored.
//   - A derivative is rebuilt only when it is missing or older than its source,
//     so a re-run on an unchanged archive rewrites nothing (keeps git history small).

import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import sharp from 'sharp'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const SRC = path.join(ROOT, 'src/assets/original-images')
const OUT = path.join(ROOT, 'src/assets/images')

/**
 * Largest long edge shipped in the repo. The biggest render request on the
 * site is `width={1600}` (home hero) / `height={LONG_EDGE}` (gallery plates),
 * so 2400 leaves headroom for a future 1.5x bump without touching the archive.
 */
const LONG_EDGE = 2400
const JPEG_QUALITY = 86

const RASTER = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp', '.avif'])
const COPY = new Set(['.svg'])

const args = new Set(process.argv.slice(2))
const force = args.has('--force')
const prune = args.has('--prune')

async function walk(dir, rel = '') {
  const out = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const relPath = path.join(rel, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(path.join(dir, entry.name), relPath)))
    else out.push(relPath)
  }
  return out
}

function outputName(rel) {
  const ext = path.extname(rel).toLowerCase()
  if (ext === '.jpeg') return rel.slice(0, -ext.length) + '.jpg'
  if (ext === '.tif' || ext === '.tiff' || ext === '.webp' || ext === '.avif')
    return rel.slice(0, -ext.length) + '.jpg'
  return rel
}

async function stale(src, out) {
  if (force) return true
  try {
    const [s, o] = await Promise.all([fs.stat(src), fs.stat(out)])
    return o.mtimeMs < s.mtimeMs
  } catch {
    return true // output missing
  }
}

async function build(rel) {
  const src = path.join(SRC, rel)
  const ext = path.extname(rel).toLowerCase()
  const outRel = outputName(rel)
  const out = path.join(OUT, outRel)

  if (!(await stale(src, out))) return { rel: outRel, skipped: true }
  await fs.mkdir(path.dirname(out), { recursive: true })

  if (COPY.has(ext)) {
    await fs.copyFile(src, out)
    return { rel: outRel, copied: true }
  }

  let pipeline = sharp(src, { failOn: 'error' })
    .rotate() // bake EXIF orientation into the pixels
    .resize({ width: LONG_EDGE, height: LONG_EDGE, fit: 'inside', withoutEnlargement: true })
    .toColorspace('srgb')

  pipeline =
    path.extname(outRel) === '.png'
      ? pipeline.png({ compressionLevel: 9, palette: false })
      : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' })

  const info = await pipeline.toFile(out)
  const before = (await fs.stat(src)).size
  return { rel: outRel, before, after: info.size, width: info.width, height: info.height }
}

async function pool(items, worker, size) {
  const results = []
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) results.push(await worker(items[i++]))
    })
  )
  return results
}

/** Remove directories left empty by pruning (deepest first); never removes `dir` itself. */
async function removeEmptyDirs(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const sub = path.join(dir, entry.name)
    await removeEmptyDirs(sub)
    if ((await fs.readdir(sub)).length === 0) await fs.rmdir(sub)
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB'
const kb = (n) => Math.round(n / 1024) + ' KB'

async function main() {
  try {
    await fs.access(SRC)
  } catch {
    console.error(`No archive at ${path.relative(ROOT, SRC)}/ — nothing to do.`)
    console.error('Derivatives already in src/assets/images/ are left untouched.')
    process.exit(1)
  }

  const files = (await walk(SRC)).filter((rel) => {
    const ext = path.extname(rel).toLowerCase()
    return RASTER.has(ext) || COPY.has(ext)
  })
  files.sort()

  const results = await pool(files, build, Math.max(1, Math.min(4, os.cpus().length)))

  let built = 0, skipped = 0, before = 0, after = 0
  for (const r of results.sort((a, b) => a.rel.localeCompare(b.rel))) {
    if (r.skipped) { skipped++; continue }
    built++
    if (r.copied) { console.log(`  copy  ${r.rel}`); continue }
    before += r.before; after += r.after
    console.log(`  ${String(r.width).padStart(5)}x${String(r.height).padEnd(5)} ${kb(r.after).padStart(8)}  ${r.rel}  (was ${mb(r.before)})`)
  }

  let pruned = 0
  if (prune) {
    const expected = new Set(files.map(outputName))
    for (const rel of await walk(OUT)) {
      if (!expected.has(rel)) {
        await fs.unlink(path.join(OUT, rel))
        console.log(`  prune ${rel}`)
        pruned++
      }
    }
    await removeEmptyDirs(OUT)
  }

  console.log(
    `\n${built} built, ${skipped} up to date${prune ? `, ${pruned} pruned` : ''}` +
      (before ? ` — ${mb(before)} → ${mb(after)}` : '')
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
