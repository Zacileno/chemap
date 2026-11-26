// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.chemap.cz',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  // All pages stay static; only /api/kontakt (contact form) runs on the server.
  adapter: vercel(),
});
