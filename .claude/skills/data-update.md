---
name: data-update
description: ポケモンデータを更新する。「データ更新して」「pokemon.jsonを更新して」「スプレッドシートからデータ取り込んで」「配信データを追加して」と言ったときに使う。
user_invocable: true
---

# ポケモンデータ更新

## データファイル
`public/pokemon.json`

## 手順
1. 更新元データ（新しいJSONファイルまたはスプレッドシートエクスポート）をユーザーに確認
2. `public/pokemon.json` を読み込み、現在のデータ件数・最新エントリを把握
3. 新しいデータを `public/pokemon.json` に反映（差分を確認してから上書き）
4. JSONの構文チェックを実行:
   ```bash
   node -e "JSON.parse(require('fs').readFileSync('public/pokemon.json'))"
   ```
5. `npm run build` でビルド確認（エラーがないことを確認）
6. 変更件数と内容をユーザーに報告

## 必須フィールド
```json
{
  "managementId": "管理ID（例: 08O01）",
  "pokemonName": "ポケモン名",
  "dexNo": 数値,
  "generation": 世代番号（6-9）,
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
