<!-- layouts/default.vue -->
<script setup>
// 必要に応じてヘッダーやフッターのロジック
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
        <p>© 2025 配信ポケモン検索サイト by あかブロス</p>
        <p class="mt-2">
          当サイトはポケモンの公式サイトではありません。
          「ポケットモンスター」「ポケモン」は任天堂・クリーチャーズ・ゲームフリークの登録商標です。
        </p>
      </div>
    </footer>
  </div>
</template>
