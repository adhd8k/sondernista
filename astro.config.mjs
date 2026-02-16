// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import watermark from './src/integrations/watermark.ts';

// https://astro.build/config
export default defineConfig({
  image: {
    format: ['avif', 'webp'],
  },
  integrations: [
    watermark({
      scale: 0.10,         // 10% of image width
      opacity: 0.4,        // 40% opacity — white on black outline pops
      padding: 20,         // 20px from edge
      position: 'bottom-right',
      minWidth: 400,       // skip thumbnails
      borderWidth: 3,      // black outline thickness (px, per dilation pass)
      fillColor: { r: 255, g: 255, b: 255 },   // white signature
      borderColor: { r: 0, g: 0, b: 0 },       // black outline
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
