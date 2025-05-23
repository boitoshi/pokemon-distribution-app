export default defineNuxtConfig({
  app: {
    baseURL: "/poke-search/", // ← 実際の公開パスにあわせて！
  },
  modules: ["@nuxtjs/tailwindcss"],

  // Tailwind CSSを使うための設定も追加しておくと安心だよ♪
  // 必要に応じて他の設定を追加
  css: ["~/assets/css/tailwind.css"],

  compatibilityDate: "2025-05-12",
});
