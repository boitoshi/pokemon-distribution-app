import { Pokemon, initialPokemonData } from "./pokemon";

// GitHubからポケモンデータを取得する関数
export async function fetchPokemonData(): Promise<Pokemon[]> {
  try {
    console.log("API: データの取得を開始します...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

    const response = await fetch(
      "https://raw.githubusercontent.com/boitoshi/pokemon-data/main/event-pokemon/gen8_dist_list.json",
      {
        signal: controller.signal,
        headers: { "Cache-Control": "no-cache" },
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`HTTP エラー: ${response.status}`);
      throw new Error(`データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("API: 取得したデータが配列ではありません", data);
      throw new Error("無効なデータフォーマット");
    }

    console.log(`API: ${data.length}件のデータを取得しました`);

    // データの検証
    validatePokemonData(data);

    return data;
  } catch (error) {
    console.error("API: ポケモンデータの取得エラー:", error);
    console.log("API: ローカルデータを使用します");
    return initialPokemonData;
  }
}

// データの検証関数
function validatePokemonData(data: any[]): void {
  if (data.length === 0) {
    console.warn("API: 取得したデータが空です");
    return;
  }

  // サンプルとして最初のデータの構造を確認
  const sample = data[0];
  const requiredFields = [
    "managementId",
    "pokemonName",
    "eventName",
    "generation",
    "game",
    "distributionMethod",
  ];

  for (const field of requiredFields) {
    if (sample[field] === undefined) {
      console.warn(
        `API: 取得したデータに必須フィールド '${field}' がありません`,
        sample
      );
    }
  }
}
