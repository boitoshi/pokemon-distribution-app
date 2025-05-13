<!-- pages/pokemon/[id].vue -->
<!-- <script setup>
import { initialPokemonData } from "~/data/pokemon";

const route = useRoute();
const router = useRouter();

// IDからポケモンデータを取得
const pokemon = computed(() => {
  return initialPokemonData.find((p) => p.managementId === route.params.id);
});

// ポケモンが見つからない場合
if (!pokemon.value) {
  // SSRの場合は404を返す
  if (process.server) {
    throw createError({
      statusCode: 404,
      message: "ポケモンが見つかりません",
    });
  } else {
    // クライアントサイドではリダイレクト
    router.push("/");
  }
}

// ページメタデータ
useHead({
  title: `${pokemon.value?.pokemonName} | 配信ポケモン詳細`,
  meta: [
    {
      name: "description",
      content: `${pokemon.value?.pokemonName}の配信・配布情報の詳細です。`,
    },
  ],
});
</script>

<template>
  <div v-if="pokemon">
    <div class="mb-4">
      <NuxtLink
        to="/"
        class="text-blue-600 hover:underline inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        検索結果に戻る
      </NuxtLink>
    </div>
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-amber-400 text-white p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{ pokemon.pokemonName }}
          </h1>
          <span class="text-lg opacity-80">#{{ pokemon.dexNo }}</span>
        </div>
      </div>

      <div class="p-6">
        <div class="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 class="text-xl font-semibold mb-2">{{ pokemon.eventName }}</h2>
          <p>配信日: {{ pokemon.startDate }} ～ {{ pokemon.endDate }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">基本情報</h3>
            <dl>
              <div class="grid grid-cols-3 py-2">
                <dt class="font-medium">世代</dt>
                <dd class="col-span-2">第{{ pokemon.generation }}世代</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">ゲーム</dt>
                <dd class="col-span-2">{{ pokemon.game }}</dd>
              </div>
              <div v-if="pokemon.level" class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">レベル</dt>
                <dd class="col-span-2">{{ pokemon.level }}</dd>
              </div>
              <div v-if="pokemon.gender" class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">性別</dt>
                <dd class="col-span-2">{{ pokemon.gender }}</dd>
              </div>
              <div v-if="pokemon.shiny" class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">色違い</dt>
                <dd class="col-span-2">{{ pokemon.shiny }}</dd>
              </div>
              <div
                v-if="pokemon.gigantamax"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">特殊形態</dt>
                <dd class="col-span-2">{{ pokemon.gigantamax }}</dd>
              </div>
              <div
                v-if="pokemon.teraType"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">テラスタイプ</dt>
                <dd class="col-span-2">{{ pokemon.teraType }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">入手情報</h3>
            <dl>
              <div class="grid grid-cols-3 py-2">
                <dt class="font-medium">入手方法</dt>
                <dd class="col-span-2">{{ pokemon.distributionMethod }}</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">配信場所</dt>
                <dd class="col-span-2">{{ pokemon.distributionLocation }}</dd>
              </div>
              <div
                v-if="pokemon.metLocation"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">出会った場所</dt>
                <dd class="col-span-2">{{ pokemon.metLocation }}</dd>
              </div>
              <div v-if="pokemon.ball" class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">ボール</dt>
                <dd class="col-span-2">{{ pokemon.ball }}</dd>
              </div>
              <div v-if="pokemon.ot" class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">トレーナー名</dt>
                <dd class="col-span-2">{{ pokemon.ot }}</dd>
              </div>
              <div
                v-if="pokemon.trainerId"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">トレーナーID</dt>
                <dd class="col-span-2">{{ pokemon.trainerId }}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">
              とくせい・わざ
            </h3>
            <dl>
              <div class="grid grid-cols-3 py-2">
                <dt class="font-medium">せいかく</dt>
                <dd class="col-span-2">{{ pokemon.nature }}</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">とくせい</dt>
                <dd class="col-span-2">{{ pokemon.ability }}</dd>
              </div>
              <div
                v-if="pokemon.heldItem"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">持ち物</dt>
                <dd class="col-span-2">{{ pokemon.heldItem }}</dd>
              </div>
              <div class="grid grid-cols-3 py-2 border-t">
                <dt class="font-medium">わざ</dt>
                <dd class="col-span-2">
                  <ul class="list-disc pl-5">
                    <li v-if="pokemon.move1">{{ pokemon.move1 }}</li>
                    <li v-if="pokemon.move2">{{ pokemon.move2 }}</li>
                    <li v-if="pokemon.move3">{{ pokemon.move3 }}</li>
                    <li v-if="pokemon.move4">{{ pokemon.move4 }}</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <div v-if="pokemon.ribbon1 || pokemon.ribbon2 || pokemon.ribbon3">
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">リボン</h3>
            <dl>
              <div v-if="pokemon.ribbon1" class="grid grid-cols-3 py-2">
                <dt class="font-medium">リボン1</dt>
                <dd class="col-span-2">{{ pokemon.ribbon1 }}</dd>
              </div>
              <div
                v-if="pokemon.ribbon2"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">リボン2</dt>
                <dd class="col-span-2">{{ pokemon.ribbon2 }}</dd>
              </div>
              <div
                v-if="pokemon.ribbon3"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dt class="font-medium">リボン3</dt>
                <dd class="col-span-2">{{ pokemon.ribbon3 }}</dd>
              </div>
            </dl>
          </div>
        </div>

        追加情報があれば以下に表示
        <div v-if="pokemon.notes" class="mb-6">
          <h3 class="text-lg font-semibold mb-3 border-b pb-2">備考</h3>
          <p class="text-gray-700">{{ pokemon.notes }}</p>
        </div>

        関連記事リンクなどがあれば
        <div v-if="pokemon.wordpressLink" class="bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold mb-2">関連記事</h3>
          <a
            :href="pokemon.wordpressLink"
            target="_blank"
            rel="noopener"
            class="text-blue-600 hover:underline flex items-center"
          >
            <span>詳細解説記事を読む</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
  ロード中または404の表示
  <div v-else class="text-center p-10"><p>ポケモン情報を読み込み中...</p></div>
</template> 
-->

<template>
  <div v-if="pokemon">
    <div class="mb-4">
      <NuxtLink
        to="/"
        class="text-blue-600 hover:underline inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        検索ページに戻る
      </NuxtLink>
    </div>
    
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-amber-400 text-white p-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold">
            {{ pokemon.pokemonName }}
          </h1>
          <span class="text-lg opacity-80">#{{ pokemon.dexNo }}</span>
        </div>
      </div>

      <div class="p-6">
        <PokemonDetailCard :pokemon="pokemon" />
        
        <!-- 関連記事リンクなどがあれば -->
        <div v-if="pokemon.wordpressLink" class="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 class="text-lg font-semibold mb-2">関連記事</h3>
          <a
            :href="pokemon.wordpressLink"
            target="_blank"
            rel="noopener"
            class="text-blue-600 hover:underline flex items-center"
          >
            <span>詳細解説記事を読む</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- ロード中または404の表示 -->
  <div v-else class="text-center p-10"><p>ポケモン情報を読み込み中...</p></div>
</template>

<script setup>
import { initialPokemonData } from "~/data/pokemon";

const route = useRoute();
const router = useRouter();

// IDからポケモンデータを取得
const pokemon = computed(() => {
  return initialPokemonData.find((p) => p.managementId === route.params.id);
});

// ポケモンが見つからない場合
if (!pokemon.value) {
  // SSRの場合は404を返す
  if (process.server) {
    throw createError({
      statusCode: 404,
      message: "ポケモンが見つかりません",
    });
  } else {
    // クライアントサイドではリダイレクト
    router.push("/");
  }
}

// ページメタデータ
useHead({
  title: `${pokemon.value?.pokemonName} | 配信ポケモン詳細`,
  meta: [
    {
      name: "description",
      content: `${pokemon.value?.pokemonName}の配信・配布情報の詳細です。`,
    },
  ],
});
</script>
