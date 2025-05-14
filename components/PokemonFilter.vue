<script setup>
defineProps({
  filters: {
    type: Object,
    required: true,
  },
  uniqueValues: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:filter"]);

const handleFilterChange = (filterName, e) => {
  emit("update:filter", { name: filterName, value: e.target.value });
};
</script>

<template>
  <div class="bg-gray-50 p-4 rounded-lg shadow mb-6">
    <h2 class="text-lg font-semibold mb-3">絞り込み検索</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <!-- 世代フィルター -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">世代</label>
        <select
          :value="filters.generation"
          @change="(e) => handleFilterChange('generation', e)"
          class="w-11/12 p-2 border rounded"
        >
          <option value="">すべて</option>
          <option
            v-for="gen in uniqueValues.generations"
            :key="gen"
            :value="gen"
          >
            第{{ gen }}世代
          </option>
        </select>
      </div>

      <!-- ゲームフィルター -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >ゲーム</label
        >
        <select
          :value="filters.game"
          @change="(e) => handleFilterChange('game', e)"
          class="w-11/12 p-2 border rounded"
        >
          <option value="">すべて</option>
          <option v-for="game in uniqueValues.games" :key="game" :value="game">
            {{ game }}
          </option>
        </select>
      </div>

      <!-- 配信方法フィルター -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >配信方法</label
        >
        <select
          :value="filters.method"
          @change="(e) => handleFilterChange('method', e)"
          class="w-11/12 p-2 border rounded"
        >
          <option value="">すべて</option>
          <option
            v-for="method in uniqueValues.methods"
            :key="method"
            :value="method"
          >
            {{ method }}
          </option>
        </select>
      </div>

      <!-- ボールフィルター -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >ボール</label
        >
        <select
          :value="filters.ball"
          @change="(e) => handleFilterChange('ball', e)"
          class="w-11/12 p-2 border rounded"
        >
          <option value="">すべて</option>
          <option v-for="ball in uniqueValues.balls" :key="ball" :value="ball">
            {{ ball }}
          </option>
        </select>
      </div>

      <!-- リボン/あかしフィルター -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >リボン/あかし</label
        >
        <select
          :value="filters.ribbon"
          @change="(e) => handleFilterChange('ribbon', e)"
          class="w-11/12 p-2 border rounded"
        >
          <option value="">すべて</option>
          <option
            v-for="ribbon in uniqueValues.ribbons"
            :key="ribbon"
            :value="ribbon"
          >
            {{ ribbon }}
          </option>
        </select>
      </div>
      <!-- 他のフィルター... -->
    </div>
  </div>
</template>
