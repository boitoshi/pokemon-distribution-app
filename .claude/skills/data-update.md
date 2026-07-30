---
name: data-update
description: ポケモンデータを更新する。「データ更新して」「pokemon.jsonを更新して」「配信データを取り込んで」「配信データを追加して」と言ったときに使う。
user_invocable: true
---

# ポケモンデータ更新

## データソース（正本）
配信データの正本は `pokemon-data` リポジトリ（`distributions/gen5..gen9.json` + `champions.json`）。
本アプリの `public/pokemon.json` は正本から **pull only** で同期する（直接編集しない）。

## データファイル
`public/pokemon.json`（同期先。コミット対象）

## 手順
1. 正本側（`pokemon-data` の `distributions/*.json`）が更新されているかユーザーに確認
2. `cd ../pokemon-data && npm run build` を実行し、`build/pokemon.json` を再生成
3. 本 repo に戻り `node scripts/sync-from-pokemon-data.mjs` を実行
   （`public/pokemon.json` へ pull only で同期。件数減少ガード付き）
4. `npm run smoke` を実行し、データ整合性チェック
5. 同期前後の件数・差分をユーザーに報告
6. `npm run build` でビルド確認（エラーがないことを確認）

## フィールド例（generationは0または5〜9）
```json
{
  "managementId": "管理ID（例: 05001。Championsは CH01〜CH21 / CH-BP-M#-##）",
  "pokemonName": "ポケモン名",
  "dexNo": 数値,
  "generation": "世代番号（0=Champions, 5〜9）",
  "game": "ゲーム名",
  "eventName": "イベント名",
  "distributionMethod": "配信方法",
  "distributionLocation": "配信場所",
  "startDate": "YYYY-MM-DD"
}
```

## 技・リボンの形式（配列推奨）
```json
{
  "moves": ["わざ1", "わざ2", "わざ3", "わざ4"],
  "ribbons": ["リボン1", "リボン2"]
}
```

## 次のステップ
データ更新後 → `/build` でビルド確認 → `/preview` でプレビュー
