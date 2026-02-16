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
      opacity: 0.8,        // 80% opacity
      padding: 40,         // 40px inset from edge
      position: 'bottom-right',
      minWidth: 400,       // skip thumbnails
      borderWidth: 6,      // thicker black outline
      fillColor: { r: 255, g: 255, b: 255 },   // white signature
      borderColor: { r: 0, g: 0, b: 0 },       // black outline
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
