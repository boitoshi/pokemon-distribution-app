<!-- app.vue -->
<template>
  <div class="app-wrapper">
    <AppHeader />
    <!-- NuxtLayoutを追加するとレイアウトも適用できる -->
    <NuxtLayout>
      <!-- これがNuxtPageコンポーネントで、pages/フォルダのVueファイルがここに表示される！ -->
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
  </div>
</template>
