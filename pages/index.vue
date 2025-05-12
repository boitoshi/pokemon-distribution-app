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
    const data = await fetchPokemonData();
    if (data && data.length > 0) {
      pokemonData.value = data;
      console.log("データを取得しました:", data.length);
    } else {
      console.warn("データが空または未定義です - ローカルデータを使用します");
      // 明示的にローカルデータを使用
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
      class="p-4 bg-red-50 text-red-600 rounded-lg text-center"
    >
      <p>{{ error }}</p>
      <p class="mt-2 text-sm">ローカルデータを表示しています</p>
    </div>

    <template v-else>
      <SearchBar :searchTerm="searchTerm" @update:searchTerm="updateSearch" />

      <PokemonFilter
        :filters="filters"
        :uniqueValues="uniqueValues"
        @update:filter="handleFilterUpdate"
      />

      <PokemonList :pokemon="filteredPokemon" />
    </template>
  </div>
</template>
