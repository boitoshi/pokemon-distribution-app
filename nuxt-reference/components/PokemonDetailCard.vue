<template>
  <div class="pokemonDetail-card">
    <h2>{{ pokemon.pokemonName }}</h2>
    <p><strong>配信イベント：</strong>{{ pokemon.eventName }}</p>
    <div class="details">
      <p><strong>世代：</strong>第{{ pokemon.generation }}世代 <strong>ゲーム：</strong>{{ pokemon.game }}</p>
      <p><strong>配信方法：</strong>{{ pokemon.distributionMethod }}</p>
      <p><strong>受取期間：</strong>{{ pokemon.startDate }}〜{{ pokemon.endDate || '不明' }}</p>
      <p v-if="pokemon.ball"><strong>ボール：</strong>{{ pokemon.ball }}</p>
      <p v-if="pokemon.level"><strong>レベル：</strong>{{ pokemon.level }}</p>
      <p v-if="pokemon.gender"><strong>せいべつ：</strong>{{ pokemon.gender }}</p>
      <p v-if="pokemon.ability"><strong>とくせい：</strong>{{ pokemon.ability }}</p>
      <p v-if="pokemon.nature"><strong>せいかく：</strong>{{ pokemon.nature }}</p>
      <p v-if="pokemon.gigantamax"><strong>キョダイマックス：</strong>{{ pokemon.gigantamax }}</p>
      <p v-if="pokemon.teraType"><strong>テラスタイプ：</strong>{{ pokemon.teraType }}</p>
      <p v-if="pokemon.heldItem"><strong>持ち物：</strong>{{ pokemon.heldItem }}</p>
    </div>
    <div v-if="moves.length" class="moves-section">
      <strong>わざ:</strong>
      <ul>
        <li v-for="(move, i) in moves" :key="i">{{ move }}</li>
      </ul>
    </div>
    <div v-if="ribbons.length" class="ribbons-section">
      <strong>リボン/あかし:</strong> {{ ribbons.join(", ") }}
    </div>
    <div v-if="pokemon.notes" class="notes-section">
      <strong>備考:</strong> {{ pokemon.notes }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pokemon: Object
});

const moves = computed(() => {
  return [
    props.pokemon.move1,
    props.pokemon.move2,
    props.pokemon.move3,
    props.pokemon.move4
  ].filter(Boolean);
});

const ribbons = computed(() => {
  return [
    props.pokemon.ribbon1,
    props.pokemon.ribbon2,
    props.pokemon.ribbon3
  ].filter(Boolean);
});
</script>

<style scoped>
.pokemon-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  background: #fdfdfd;
}
.details p {
  margin: 0.25rem 0;
}
.moves-section, .ribbons-section, .notes-section {
  margin-top: 0.75rem;
}
ul {
  margin: 0.25rem 0;
  padding-left: 1.5rem;
}
</style>
