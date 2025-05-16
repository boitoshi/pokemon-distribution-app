# ポケモン配信情報検索サイト

過去に配信・配布されたポケモンの情報を検索できる非公式サイトです。Nuxt.js で構築されています。

## 機能

- 配信ポケモンの一覧表示
- 名前、世代、ゲームタイトル、配信方法などによる検索フィルター
- 詳細情報の表示
- GitHub リポジトリからの最新データ取得

## データソース

このアプリケーションは以下のリポジトリからデータを取得しています：

- [boitoshi/pokemon-data](https://github.com/boitoshi/pokemon-data) - ポケモン配布・配信情報のデータセット

## データ取得の仕組み

このアプリケーションは以下の方法でデータを取得します:

1. **ビルド時のデータ取得**: `npm run build`または`npm run generate`実行時に、`prebuild`/`pregenerate`フックが`scripts/fetch-data.js`を実行し、GitHub から最新のポケモンデータを`public/pokemon.json`として保存します。

```bash
# データ手動更新（必要な場合）
node scripts/fetch-data.js
```

2. **クライアントサイドのデータ取得**: アプリは`public/pokemon.json`を最初に読み込もうとし、失敗した場合はサーバー API を使用します。

## 本番環境用ビルド

静的サイト生成（推奨）:

```bash
# npm
npm run generate

# pnpm
pnpm generate

# yarn
yarn generate

# bun
bun run generate
```

これにより:

1. GitHub から最新の JSON データが取得されます
2. `public/pokemon.json`に保存されます
3. 静的サイトが生成され、JSON データが含まれます

## デプロイ

生成されたサイトは`.output/public`ディレクトリにあり、任意のサーバーにデプロイできます:

```bash
# 例: GitHub Pagesへのデプロイ
npm run generate
# 生成されたファイルをGitHub Pagesにデプロイ
```

## プロジェクト構造

- `pages/` - ページコンポーネント
- `components/` - 再利用可能な Vue コンポーネント
- `public/` - 静的ファイル（JSON データを含む）
- `scripts/` - データ取得などのユーティリティスクリプト
- `composables/` - 再利用可能なロジック
- `data/` - データモデルと API 関連機能

## 技術スタック

- [Nuxt.js](https://nuxt.com/) - Vue ベースのフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - スタイリング
- [TypeScript](https://www.typescriptlang.org/) - 型安全

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

このアプリケーションは非公式のファンプロジェクトであり、株式会社ポケモン、任天堂、またはその関連会社とは一切関係ありません。ポケモン関連の商標はそれぞれの所有者に帰属します。
