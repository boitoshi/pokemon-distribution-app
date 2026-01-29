# Pokemon Distribution App - Claude Code ガイド

## プロジェクト概要

配信ポケモン情報を検索できる日本語の静的Webサイト。Astroで構築し、GitHub Pagesでホスティング。

## クイックスタート

```bash
npm install     # 依存関係インストール
npm run dev     # 開発サーバー起動 (http://localhost:4321)
npm run build   # 本番ビルド (dist/)
npm run preview # ビルド結果プレビュー
```

## プロジェクト構造

```
src/
├── pages/
│   └── index.astro         # メインページ（検索ロジック含む）
├── components/
│   ├── SearchBox.astro     # 検索UI（フィルター機能）
│   └── PokemonCard.astro   # カード表示・モーダルテンプレート
└── layouts/
    └── Layout.astro        # 共通レイアウト・グローバルCSS

public/
└── pokemon.json            # 配信ポケモンデータ

nuxt-reference/             # 参考用Nuxt版（修正不要）
```

## パスエイリアス

- `@/*` → `src/*`

## 重要な技術的決定

### データ構造

`pokemon.json` の各エントリには以下のフィールドが含まれる:

- **必須**: managementId, pokemonName, dexNo, generation, game, eventName, distributionMethod, distributionLocation, startDate
- **オプション**: shiny, endDate, ot, trainerId, ball, level, ability, nature, gigantamax, teraType, isAlpha, heldItem, moves[], ribbons[], notes, postUrl

### moves/ribbons の互換性

- 配列形式（推奨）: `moves: ["わざ1", "わざ2"]`
- カラム形式（後方互換）: `move1`, `move2`, `move3`, `move4`

### ゲーム固有の表示ロジック

- **キョダイマックス**: ソード/シールドのみ表示
- **テラスタイプ**: スカーレット/バイオレットのみ表示
- **オヤブン**: アルセウス/Z-Aのみ表示

## コーディング規約

### Astroコンポーネント

- フロントマターでTypeScript interfaceを定義（`PokemonCard.astro`を参照）
- グローバルCSSは`Layout.astro`の `<style is:global>` に記述
- クライアントサイドJSは `<script>` タグ内に記述

### スタイリング

- インラインCSS（Tailwindは未使用、グローバルCSSで統一）
- カラースキーム: プライマリ `#1a237e`（ダークブルー）、アクセント `#1976d2`（ブルー）
- レスポンシブ: `@media (max-width: 768px)` で対応

### 日本語テキスト

- UIテキストはすべて日本語
- 日付フォーマット: `YYYY/MM/DD`

## デプロイ

GitHub Pagesにデプロイ:

- サイトURL: https://boitoshi.github.io
- ベースパス: /pokemon-distribution-app
- 設定: `astro.config.mjs`

## データ更新手順

1. GoogleスプレッドシートでデータをJSON形式でエクスポート
2. `public/pokemon.json` を置き換え
3. `npm run build` でビルド確認
4. mainブランチにプッシュ

## 注意事項

- `nuxt-reference/` は参考用。直接修正しない
- `.github/workflows/nuxthub.yml` は旧Nuxt設定（Astro用に要更新）
