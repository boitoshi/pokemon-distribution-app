import { defineEventHandler } from "h3";
import { Pokemon } from "~/data/pokemon";

export default defineEventHandler(async (event) => {
  try {
    console.log("サーバー: GitHubからデータの取得を開始します...");

    // GitHubからデータを取得
    const response = await fetch(
      "https://raw.githubusercontent.com/boitoshi/pokemon-data/main/event-pokemon/gen8_dist_list.json",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "pokemon-distribution-app",
        },
        // タイムアウトを設定
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API エラー: ${response.status}`);
    }

    const data = await response.json();

    // データが配列であることを確認
    if (!Array.isArray(data)) {
      console.error("サーバー: 取得したデータが配列ではありません");
      throw new Error("無効なデータ形式です");
    }

    console.log(`サーバー: ${data.length}件のデータを取得しました`);
    return data;
  } catch (error) {
    console.error("サーバー: データ取得エラー:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `APIでのデータ取得失敗: ${
        error instanceof Error ? error.message : "不明なエラー"
      }`,
    });
  }
});
