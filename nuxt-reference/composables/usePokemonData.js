import { ref, onMounted } from "vue";
import { initialPokemonData } from "~/data/pokemon";

export function usePokemonData() {
  const pokemonList = ref(initialPokemonData || []);
  const loading = ref(true);
  const error = ref(null);

  async function fetchPokemonData() {
    loading.value = true;
    error.value = null;

    try {
      const data = await $fetch("/poke-search/pokemon.json");
      if (Array.isArray(data) && data.length > 0) {
        pokemonList.value = data;
      }
    } catch (err) {
      console.error("ポケモンデータの取得中にエラーが発生しました:", err);
      error.value = err.message || "データの取得に失敗しました";
      // エラー時はinitialPokemonDataを使用（すでに設定済み）
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchPokemonData();
  });

  return {
    pokemonList,
    loading,
    error,
    fetchPokemonData,
  };
}
