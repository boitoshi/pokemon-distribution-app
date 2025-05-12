<!-- pages/pokemon/[id].vue -->
<script setup>
import { initialPokemonData } from "~/data/pokemon";

const route = useRoute();
const router = useRouter();

// IDからポケモンデータを取得
const pokemon = computed(() => {
  return initialPokemonData.find((p) => p.managementId === route.params.id);
});

// ポケモンが見つからない場合
if (!pokemon.value) {
  // SSRの場合は404を返す
  if (process.server) {
    throw createError({
      statusCode: 404,
      message: "ポケモンが見つかりません",
    });
  } else {
    // クライアントサイドではリダイレクト
    router.push("/");
  }
}

// ページメタデータ
useHead({
  title: `${pokemon.value?.pokemonName} | 配信ポケモン詳細`,
  meta: [
    {
      name: "description",
      content: `${pokemon.value?.pokemonName}の配信・配布情報の詳細です。`,
    },
  ],
});
</script>

<template>
  <div v-if="pokemon">
    <div class="mb-4">
      <NuxtLink
        to="/"
        class="text-blue-600 hover:underline inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        検索結果に戻る
      </NuxtLink>
    </div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-blue-600 text-white p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{ pokemon.pokemonName }}
          </h1>
          <span class="text-lg opacity-80">#{{ pokemon.dexNo }}</span>
        </div>
      </div>

      <div class="p-6">
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 class="text-xl font-semibold mb-2">{{ pokemon.eventName }}</h2>
          <p>配信日: {{ pokemon.startDate }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">基本情報</h3>
            <dl>
              <div class="grid grid-cols-3 py-2">
                <dt class="font-medium">世代</dt>
                <dd class="col-span-2">第{{ pokemon.generation }}世代</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">ゲーム</dt>
                <dd class="col-span-2">{{ pokemon.game }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">入手情報</h3>
            <dl>
              <div class="grid grid-cols-3 py-2">
                <dt class="font-medium">入手方法</dt>
                <dd class="col-span-2">{{ pokemon.distributionMethod }}</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">配信場所</dt>
                <dd class="col-span-2">{{ pokemon.destributionLocation }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- 追加情報があれば以下に表示 -->
        <div v-if="pokemon.description" class="mb-6">
          <h3 class="text-lg font-semibold mb-3 border-b pb-2">イベント詳細</h3>
          <p class="text-gray-700">{{ pokemon.description }}</p>
        </div>

        <!-- 関連記事リンクなどがあれば -->
        <div v-if="pokemon.wordpressLink" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">関連記事</h3>
          <a
            :href="pokemon.wordpressLink"
            target="_blank"
            rel="noopener"
            class="text-blue-600 hover:underline flex items-center"
          >
            <span>詳細解説記事を読む</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- ロード中または404の表示 -->
  <div v-else class="text-center p-10"><p>ポケモン情報を読み込み中...</p></div>
</template>
