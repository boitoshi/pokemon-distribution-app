<script setup>
defineProps({
  searchTerm: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:searchTerm']);

const handleSearch = (e) => {
  emit('update:searchTerm', e.target.value);
};
</script>

<template>
  <div class="mb-6">
    <div class="relative">
      <input
        type="text"
        :value="searchTerm"
        @input="handleSearch"
        placeholder="ポケモン名・配信イベント名で検索..."
        class="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
      />
      <div class="absolute left-3 top-3 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>
