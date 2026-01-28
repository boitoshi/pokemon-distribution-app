# ポケモン配信情報検索サイト

過去に配信・配布されたポケモンの情報を検索できる非公式サイトです。Astroで構築されています。

## 構成

```
pokemon-distribution-app/
├── src/
│   ├── pages/
│   │   └── index.astro         ← メインページ
│   ├── components/
│   │   ├── SearchBox.astro     ← 検索UI
│   │   └── PokemonCard.astro   ← カード表示
│   └── layouts/
│       └── Layout.astro        ← 共通レイアウト
├── public/
│   └── pokemon.json            ← ポケモンデータ
├── astro.config.mjs
├── package.json
└── nuxt-reference/             ← Nuxt版（参考用）
```

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## デプロイ

```bash
npm run build
```

`dist/` フォルダが生成されます。これをGitHub Pagesや任意のWebサーバーにデプロイしてください。

### GitHub Pages へのデプロイ

`astro.config.mjs` でサイトURLとベースパスを設定済みです：

```javascript
export default defineConfig({
  site: 'https://boitoshi.github.io',
  base: '/pokemon-distribution-app',
});
```

## 機能

- 配信ポケモンの一覧表示
- ポケモン名・イベント名で検索
- 世代、ゲーム、配信方法でフィルター
- 色違い、キョダイマックス、テラスタイプでフィルター

## データの更新

GoogleスプレッドシートからJSONをエクスポートして `public/pokemon.json` を置き換えてください。

## データ形式

`pokemon.json` のデータ形式：

```json
{
  "managementId": "08O01",
  "pokemonName": "ニャース",
  "shiny": "",
  "dexNo": 52,
  "generation": 8,
  "game": "ソード, シールド",
  "eventName": "早期購入特典",
  "distributionMethod": "オンライン",
  "distributionLocation": "オンライン",
  "startDate": "2019-11-14",
  "endDate": "2020-01-14",
  "ot": "(プレイヤーのもの)",
  "trainerId": "(プレイヤーのもの)",
  "ball": "プレシャスボール",
  "level": 5,
  "ability": "ものひろい",
  "nature": "ランダム",
  "gigantamax": "キョダイマックス",
  "teraType": "",
  "heldItem": "",
  "move1": "ねこだまし",
  "move2": "なきごえ",
  "move3": "きりさく",
  "move4": "ネコにこばん",
  "ribbon1": "クラシックリボン",
  "notes": ""
}
```

## 参考用：Nuxt版

`nuxt-reference/` フォルダにNuxt.jsで構築したバージョンがあります。
将来的に機能を拡張したい場合の参考として残しています。

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

このアプリケーションは非公式のファンプロジェクトであり、株式会社ポケモン、任天堂、またはその関連会社とは一切関係ありません。ポケモン関連の商標はそれぞれの所有者に帰属します。
