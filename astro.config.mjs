import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';

const isProd = process.env.DEPLOY_TARGET === 'production';
const base = isProd ? '/distribution/search' : '/pokemon-distribution-app';

// 重複エントリの転送（重複id → 本来のid）。scripts/sync-from-pokemon-data.mjs が pokemon-data の
// build/meta.json から src/data/redirects.json へ写す。転送元には Astro が base を付けるが、
// 転送先には付けないので自分で付ける。
const duplicateRedirects = Object.fromEntries(
  Object.entries(JSON.parse(readFileSync(new URL('./src/data/redirects.json', import.meta.url), 'utf8'))).map(
    ([from, to]) => [`/pokemon/${from}`, `${base}/pokemon/${to}/`],
  ),
);

export default defineConfig({
  site: isProd ? 'https://www.pokebros.net' : 'https://boitoshi.github.io',
  base,
  redirects: duplicateRedirects,
});
