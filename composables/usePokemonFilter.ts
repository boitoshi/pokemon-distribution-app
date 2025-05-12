import { ref, computed, Ref, isRef } from "vue";
import type { Pokemon } from "../data/pokemon";

export function usePokemonFilter(pokemonData: Ref<Pokemon[]> | Pokemon[]) {
  // データが参照型かチェックしてアンラップ
  const pokemonRef = isRef(pokemonData) ? pokemonData : ref(pokemonData);

  // フィルターの型定義
  interface Filters {
    generation: string;
    game: string;
    version: string;
    method: string;
    location: string;
    startYear: string;
    endYear: string;
    [key: string]: string;
  }

  const searchTerm = ref("");
  const filters = ref<Filters>({
    generation: "",
    game: "",
    version: "",
    method: "",
    location: "",
    startYear: "",
    endYear: "",
  });

  // メモ化された一意の値計算
  const uniqueGenerations = computed(() =>
    [...new Set(pokemonRef.value.map((p) => p.generation))].sort()
  );
  const uniqueGames = computed(() =>
    [...new Set(pokemonRef.value.map((p) => p.game))].sort()
  );
  const uniqueMethods = computed(() =>
    [...new Set(pokemonRef.value.map((p) => p.distributionMethod))].sort()
  );

  const uniqueValues = computed(() => ({
    generations: uniqueGenerations.value,
    games: uniqueGames.value,
    methods: uniqueMethods.value,
  }));

  const filteredPokemon = computed(() => {
    const searchLower = searchTerm.value.toLowerCase();

    return pokemonRef.value.filter((pokemon) => {
      // 名前での検索
      const nameMatch =
        searchTerm.value === "" ||
        pokemon.pokemonName.toLowerCase().includes(searchLower) ||
        pokemon.eventName.toLowerCase().includes(searchLower);

      // 各フィルター条件のチェック
      const genMatch =
        filters.value.generation === "" ||
        String(pokemon.generation) === filters.value.generation;

      const gameMatch =
        filters.value.game === "" || pokemon.game === filters.value.game;

      const methodMatch =
        filters.value.method === "" ||
        pokemon.distributionMethod === filters.value.method;

      const dateMatch =
        (filters.value.startYear === "" ||
          new Date(pokemon.startDate).getFullYear() >=
            parseInt(filters.value.startYear)) &&
        (filters.value.endYear === "" ||
          (pokemon.endDate
            ? new Date(pokemon.endDate).getFullYear() <=
              parseInt(filters.value.endYear)
            : true));

      return nameMatch && genMatch && gameMatch && methodMatch && dateMatch;
    });
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
    updateSearch,
  };
}
