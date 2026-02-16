// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  image: {
    format: ['avif', 'webp'],
  },
  integrations: [],
  vite: {
    plugins: [tailwindcss()]
  }
});
