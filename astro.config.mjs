import { defineConfig } from 'astro/config';

const isProd = process.env.DEPLOY_TARGET === 'production';

export default defineConfig({
  site: isProd ? 'https://www.pokebros.net' : 'https://boitoshi.github.io',
  base: isProd ? '/distribution/search' : '/pokemon-distribution-app',
});
