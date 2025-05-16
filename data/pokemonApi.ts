import { Pokemon, initialPokemonData } from "./pokemon";

// サーバーAPIからポケモンデータを取得する関数
export async function fetchPokemonData(): Promise<Pokemon[]> {
  try {
    console.log("API: データの取得を開始します...");

    // fetchを使ってデータを取得
    const response = await fetch("/poke-search/pokemon.json");

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

    // データが空の場合は初期データを返す
    if (data.length === 0) {
      console.warn("API: 取得したデータが空のため初期データを使用します");
      return initialPokemonData;
    }

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

  // データの形式や必須フィールドをより厳密に確認
  const validItems = data.filter((item) => {
    // 必須フィールドが全て存在するかチェック
    const requiredFields = [
      "managementId",
      "pokemonName",
      "eventName",
      "generation",
      "game",
      "distributionMethod",
    ];

    const hasAllRequiredFields = requiredFields.every(
      (field) => item[field] !== undefined && item[field] !== null
    );

    if (!hasAllRequiredFields) {
      console.warn("API: 必須フィールドが欠けている項目があります", item);
    }

    return hasAllRequiredFields;
  });

  console.log(`API: 検証済みデータ数: ${validItems.length}/${data.length}`);

  // サンプルデータの構造を表示（デバッグ用）
  if (validItems.length > 0) {
    console.log(
      "API: データサンプル:",
      JSON.stringify(validItems[0]).substring(0, 200) + "..."
    );
  }
}
