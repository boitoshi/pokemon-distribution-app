<!-- layouts/default.vue -->
<script setup>
useHead({
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "format-detection", content: "telephone=no" },
    { name: "robots", content: "index, follow" },
    { property: "og:site_name", content: "配信ポケモン検索" },
    { property: "og:type", content: "website" },
  ],
  link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-amber-400 text-white shadow-md">
      <div class="container mx-auto px-4 py-4">
        <NuxtLink to="/" class="text-xl font-bold">配信ポケモン検索</NuxtLink>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center text-sm">
        <p>© 2025 配信ポケモン検索サイト by pokebros</p>
        <p class="mt-2">
          当サイトはポケモンの公式サイトではありません。
          「ポケットモンスター」「ポケモン」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
        </p>
      </div>
    </footer>
  </div>
</template>
