---
name: data-update
description: ポケモンデータの更新方法を案内します
user_invocable: true
---

<skill>

## ポケモンデータ更新

### データファイル

`public/pokemon.json`

### 更新手順

1. GoogleスプレッドシートでデータをJSONエクスポート
2. `public/pokemon.json` を新しいファイルで置き換え
3. JSONの形式を確認

### 必須フィールド

```json
{
  "managementId": "必須: 管理ID（例: 08O01）",
  "pokemonName": "必須: ポケモン名",
  "dexNo": "必須: 図鑑番号（数値）",
  "generation": "必須: 世代番号（6-9）",
  "game": "必須: ゲーム名",
  "eventName": "必須: イベント名",
  "distributionMethod": "必須: 配信方法",
  "distributionLocation": "必須: 配信場所",
  "startDate": "必須: 開始日（YYYY-MM-DD形式）"
}
```

### 技・リボンの形式

推奨（配列形式）:
```json
{
  "moves": ["わざ1", "わざ2", "わざ3", "わざ4"],
  "ribbons": ["リボン1", "リボン2"]
}
```

後方互換（カラム形式）:
```json
{
  "move1": "わざ1",
  "move2": "わざ2",
  "ribbon1": "リボン1"
}
```

### 確認コマンド

```bash
# JSONの構文チェック
node -e "JSON.parse(require('fs').readFileSync('public/pokemon.json'))"

# ビルド確認
npm run build
```

</skill>
