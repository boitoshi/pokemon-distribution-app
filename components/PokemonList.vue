<script setup>
defineProps({
  pokemon: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div>
    <p class="mb-4">検索結果: {{ pokemon.length }}件</p>
    
    <div v-if="pokemon.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PokemonCard 
        v-for="item in pokemon" 
        :key="item.id" 
        :pokemon="item" 
      />
    </div>
    <div v-else class="bg-gray-50 p-8 text-center rounded-lg">
      <p class="text-gray-500">該当するポケモンが見つかりませんでした。検索条件を変更してください。</p>
    </div>
  </div>
</template>
