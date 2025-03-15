// composables/usePokemonFilter.ts
import { ref, computed } from 'vue';
import type { Pokemon } from '~/data/pokemon.ts';

export function usePokemonFilter(pokemonData: Pokemon[]) {

// フィルターの型定義
interface Filters {
    generation: string;
    game: string;
    version: string;
    method: string;
    location: string;
    startYear: string;
    endYear: string;
    [key: string]: string; // インデックスシグネチャを追加
  }

  const searchTerm = ref('');
  const filters = ref<Filters>({
    generation: '',
    game: '',
    version: '',
    method: '',
    location: '',
    startYear: '',
    endYear: ''
  });


  const filteredPokemon = computed(() => {
    const searchLower = searchTerm.value.toLowerCase();
    
    return pokemonData.filter(pokemon => {
      // 名前での検索（日本語と英語）
      const nameMatch = 
        searchTerm.value === '' || 
        pokemon.name.ja.toLowerCase().includes(searchLower) || 
        pokemon.name.en.toLowerCase().includes(searchLower) ||
        pokemon.eventName.toLowerCase().includes(searchLower);
      
      // 各フィルター条件のチェック
      const genMatch = 
        filters.value.generation === '' || 
        String(pokemon.generation) === filters.value.generation;
        
      const gameMatch = 
        filters.value.game === '' || 
        pokemon.game === filters.value.game;
      
      // 他のフィルター条件も同様に...
      
      return nameMatch && genMatch && gameMatch /* 他の条件 */;
    });
  });

  // ユニークな値を計算（セレクトボックス用）
  const uniqueValues = computed(() => {
    return {
      generations: [...new Set(pokemonData.map(p => p.generation))].sort(),
      games: [...new Set(pokemonData.map(p => p.game))].sort(),
      methods: [...new Set(pokemonData.map(p => p.method))].sort(),
      // その他のフィルター項目...
    };
  });

  // フィルター更新関数
  function updateFilter(filterName: string, value: string) {
    filters.value[filterName] = value;
  }
  
  // 検索語句更新関数
  function updateSearch(term: string) {
    searchTerm.value = term;
  }

  return {
    searchTerm,
    filters,
    filteredPokemon,
    uniqueValues,
    updateFilter,
    updateSearch
  };
}
