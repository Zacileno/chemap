// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.chemap.cz',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
