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
      scale: 0.08,        // 8% of image width
      opacity: 0.15,       // 15% opacity
      padding: 20,         // 20px from edge
      position: 'bottom-right',
      minWidth: 400,       // skip thumbnails
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
