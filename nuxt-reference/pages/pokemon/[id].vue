<!-- pages/pokemon/[id].vue -->
<script setup>
import { usePokemonData } from "~/composables/usePokemonData";

const route = useRoute();
const router = useRouter();
const { pokemonList, loading, error } = usePokemonData();

// IDからポケモンデータを取得
const pokemon = computed(() => {
  return pokemonList.value.find((p) => p.managementId === route.params.id);
});

// ページメタデータ
useHead(() => ({
  title: pokemon.value
    ? `${pokemon.value.pokemonName} | 配信ポケモン詳細`
    : "読み込み中...",
  meta: [
    {
      name: "description",
      content: pokemon.value
        ? `${pokemon.value.pokemonName}の配信・配布情報の詳細です。`
        : "配信ポケモンの詳細情報ページです。",
    },
  ],
}));

// クライアントサイドのみでの処理
onMounted(() => {
  // データ読み込み後にポケモンが見つからない場合はリダイレクト
  watch([loading, pokemonList], ([isLoading, list]) => {
    if (!isLoading && list.length > 0 && !pokemon.value) {
      router.push("/");
    }
  });
});

// SSRの場合は404を返す（APIデータがない場合）
if (process.server && !pokemon.value) {
  throw createError({
    statusCode: 404,
    message: "ポケモンが見つかりません",
  });
}
</script>

<template>
  <div v-if="loading" class="text-center p-10">
    <p>ポケモン情報を読み込み中...</p>
  </div>

  <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
    <h2 class="text-lg font-semibold text-red-700 mb-2">データ取得エラー</h2>
    <p>{{ error }}</p>
    <p class="mt-4">
      詳細情報の取得に失敗しました。<NuxtLink
        to="/"
        class="text-blue-600 hover:underline"
        >一覧に戻る</NuxtLink
      >
    </p>
  </div>

  <div v-else-if="pokemon">
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
                <dt class="font-medium">キョダイマックス</dt>
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
            <h3 class="text-lg font-semibold mb-3 border-b pb-2">
              リボン/あかし
            </h3>
            <dl>
              <div v-if="pokemon.ribbon1" class="grid grid-cols-3 py-2">
                <dd class="col-span-2 flex items-center">
                  <span
                    class="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"
                  ></span>
                  {{ pokemon.ribbon1 }}
                </dd>
              </div>
              <div
                v-if="pokemon.ribbon2"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dd class="col-span-2 flex items-center">
                  <span
                    class="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"
                  ></span>
                  {{ pokemon.ribbon2 }}
                </dd>
              </div>
              <div
                v-if="pokemon.ribbon3"
                class="grid grid-cols-3 py-2 border-t"
              >
                <dd class="col-span-2 flex items-center">
                  <span
                    class="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"
                  ></span>
                  {{ pokemon.ribbon3 }}
                </dd>
              </div>
              <div
                v-if="!pokemon.ribbon1 && !pokemon.ribbon2 && !pokemon.ribbon3"
                class="py-2 text-gray-500 italic"
              >
                なし
              </div>
            </dl>
          </div>
        </div>

        <!-- 追加情報があれば以下に表示 -->
        <div v-if="pokemon.notes" class="mb-6">
          <h3 class="text-lg font-semibold mb-3 border-b pb-2">備考</h3>
          <p class="text-gray-700">{{ pokemon.notes }}</p>
        </div>

        <!-- 関連記事リンクなどがあれば -->
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

  <div v-else class="text-center p-10">
    <p>指定されたポケモンが見つかりません</p>
    <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block"
      >一覧に戻る</NuxtLink
    >
  </div>
</template>
