import { defineEventHandler } from "h3";
import { Pokemon } from "~/data/pokemon";
import { initialPokemonData } from "~/data/pokemon";

export default defineEventHandler(async (event) => {
  try {
    console.log("サーバー: GitHubからデータの取得を開始します...");

    const response = await fetch(
      "https://raw.githubusercontent.com/boitoshi/pokemon-data/main/event-pokemon/gen8_dist_list.json",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "pokemon-distribution-app",
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API エラー: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("サーバー: 取得したデータが配列ではありません");
      throw new Error("無効なデータ形式です");
    }

    console.log(`サーバー: ${data.length}件のデータを取得しました`);
    return data;
  } catch (error) {
    console.error("サーバー: データ取得エラー:", error);
    console.log("サーバー: ローカルデータを使用します");

    // APIのエラー時は、ローカルの初期データを返す
    return initialPokemonData;
  }
});
