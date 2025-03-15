export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  // Tailwind CSSを使うための設定も追加しておくと安心だよ♪
  css: [
    '~/assets/css/tailwind.css'
  ],
  // 必要に応じて他の設定を追加
})
