<script setup>
defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="border bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
    <div class="flex justify-between items-start mb-2">
      <h3 class="text-lg font-semibold">{{ pokemon.name.ja }}</h3>
      <span class="text-sm text-gray-500">#{{ pokemon.dexNo }}</span>
    </div>
    <p class="text-sm text-gray-600 mb-2">{{ pokemon.name.en }}</p>
    
    <div class="bg-gray-50 p-3 rounded mb-3">
      <p class="font-medium">{{ pokemon.eventName }}</p>
      <p class="text-sm">配信日: {{ pokemon.releaseDate }}</p>
    </div>
    
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div class="text-sm">
        <span class="font-medium">ゲーム:</span> {{ pokemon.game }}
      </div>
      <div class="text-sm">
        <span class="font-medium">世代:</span> 第{{ pokemon.generation }}世代
      </div>
      <div class="text-sm">
        <span class="font-medium">入手方法:</span> {{ pokemon.method }}
      </div>
      <div class="text-sm">
        <span class="font-medium">配信場所:</span> {{ pokemon.location }}
      </div>
    </div>
    
    <div class="text-right">
      <NuxtLink 
        :to="`/pokemon/${pokemon.id}`"
        class="text-blue-500 hover:underline text-sm"
      >
        詳細を見る →
      </NuxtLink>
    </div>
  </div>
</template>
