<!-- pages/index.vue -->
<script setup>
import { initialPokemonData } from '~/data/pokemon';
import { usePokemonFilter } from '~/composables/usePokemonFilter';

// フィルタリングロジックを使用
const { 
  searchTerm, 
  filters, 
  filteredPokemon, 
  uniqueValues, 
  updateFilter, 
  updateSearch 
} = usePokemonFilter(initialPokemonData);

// フィルター更新ハンドラー
const handleFilterUpdate = ({ name, value }) => {
  updateFilter(name, value);
};

// ページメタデータ
useHead({
  title: '配信ポケモン検索 | 公式配布ポケモン情報',
  meta: [
    { name: 'description', content: 'ポケモンの公式配信・配布情報を検索できるサイト' }
  ]
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">配信・配布ポケモン検索</h1>
    <p class="mb-6 text-gray-600">
      公式に配信・配布されたポケモンの情報を検索できます。
      ゲームタイトル、世代、配信方法などから絞り込み検索が可能です。
    </p>
    
    <SearchBar 
      :searchTerm="searchTerm"
      @update:searchTerm="updateSearch"  
    />
    
    <PokemonFilter
      :filters="filters"
      :uniqueValues="uniqueValues"
      @update:filter="handleFilterUpdate"
    />
    
    <PokemonList :pokemon="filteredPokemon" />
  </div>
</template>
