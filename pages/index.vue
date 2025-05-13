<!-- pages/index.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { initialPokemonData } from "~/data/pokemon";
import { fetchPokemonData } from "~/data/pokemonApi";
import { usePokemonFilter } from "~/composables/usePokemonFilter";

// データの状態管理
const pokemonData = ref(initialPokemonData);
const loading = ref(true);
const error = ref(null);

// データの読み込み
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null; // エラー状態をリセット
    console.log("データの取得を開始します...");

    const data = await fetchPokemonData();

    if (data && Array.isArray(data) && data.length > 0) {
      // データが正常に取得できた場合
      pokemonData.value = data;
      console.log("データを取得しました:", data.length);
    } else {
      // データが空または無効な場合
      console.warn("データが空または無効です - ローカルデータを使用します");
      pokemonData.value = initialPokemonData;
    }
  } catch (err) {
    console.error("ポケモンデータの読み込みエラー:", err);
    error.value = "データの読み込みに失敗しました。";
    // エラー時もローカルデータを確実に使用
    pokemonData.value = initialPokemonData;
  } finally {
    loading.value = false;
    console.log("ローディング状態:", loading.value);
    console.log("表示するデータ数:", pokemonData.value.length);
  }
});

// フィルタリングロジックを使用（refオブジェクト自体を渡す）
const {
  searchTerm,
  filters,
  filteredPokemon,
  uniqueValues,
  updateFilter,
  updateSearch,
} = usePokemonFilter(pokemonData);

// フィルター更新ハンドラー
const handleFilterUpdate = ({ name, value }) => {
  updateFilter(name, value);
};

// ページメタデータ
useHead({
  title: "配信ポケモン検索 | 公式配布ポケモン情報",
  meta: [
    {
      name: "description",
      content: "ポケモンの公式配信・配布情報を検索できるサイト",
    },
  ],
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">配信・配布ポケモン検索</h1>
    <p class="mb-6 text-gray-600">
      公式に配信・配布されたポケモンの情報を検索できます。
      ゲームタイトル、世代、配信方法などから絞り込み検索が可能です。
    </p>

    <div v-if="loading" class="p-4 text-center">
      <p class="text-lg">データを読み込み中...</p>
    </div>

    <div
      v-else-if="error"
      class="p-6 bg-red-50 border border-red-200 rounded-lg my-4"
    >
      <h2 class="text-lg font-semibold text-red-700 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline-block mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        データ取得エラー
      </h2>
      <p class="text-gray-700">{{ error }}</p>
      <p class="mt-3 text-sm text-gray-600">
        ローカルデータを使用して表示しています。最新の情報ではない可能性があります。
      </p>
      <button
        @click="retryFetch"
        class="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        再読み込みする
      </button>
    </div>

    <template v-else>
      <SearchBar
        :searchTerm="searchTerm"
        @update:searchTerm="updateSearch"
        class="border-amber-300 focus:border-amber-500"
      />

      <PokemonFilter
        :filters="filters"
        :uniqueValues="uniqueValues"
        @update:filter="handleFilterUpdate"
      />

      <PokemonList :pokemon="filteredPokemon" />
    </template>
  </div>
</template>
