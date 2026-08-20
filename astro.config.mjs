// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// https://astro.build/config
export default defineConfig({
  site: 'https://sondernista.com',
  redirects: {
    // /assignments became /cv when the page grew to hold exhibitions and
    // publications. Keep the old URL alive for anything already linking to it.
    '/assignments': '/cv',
  },
  integrations: [],
  vite: {
    plugins: [tailwindcss()]
  },
  "server": {
    "allowedHosts": ["localhost", "helios.home.luser.host"]
  }
});
