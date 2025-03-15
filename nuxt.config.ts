// filepath: /Users/akabros/Documents/code/pokemon-distribution-app/nuxt.config.ts
export default defineNuxtConfig({
  // Nuxt 3 の設定をここに記述します
  css: [
    '~/assets/css/tailwind.css'
  ],
  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
});
