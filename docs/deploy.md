# デプロイ手順

## 決定事項（2026-08-03）

`/distribution/` 配下の本番デプロイ正本は pokebros-tools の summary-pages 側（2026-07-29 決定）。本アプリは「検索・タイムライン・コレクション管理ツール」に純化し、summary-pages とは別の流入導線として二段階でデプロイする。

1. **①ベータ: GitHub Pages**（`https://boitoshi.github.io/pokemon-distribution-app/`）
   main ブランチへの push で `.github/workflows/deploy-pages.yml` が自動デプロイする。`DEPLOY_TARGET` 未設定＝このターゲットで、`astro.config.mjs` の `base` は `/pokemon-distribution-app`。**全ページ `noindex`**（`Layout.astro` が `DEPLOY_TARGET !== 'production'` を検知して自動付与）。
2. **②本番（ベータ確認後）: ConoHa FTP**
   配置先 `public_html/distribution/search/` → 公開URL `https://www.pokebros.net/distribution/search/`。
   `npm run build:prod`（`DEPLOY_TARGET=production` でビルド、`base` は `/distribution/search`）＋ 手動FTPアップロード。将来的には summary-pages と同様に `deploy-ftp.yml` で自動化予定（未実装）。

`base` は `DEPLOY_TARGET` 環境変数で切り替わる（`astro.config.mjs` 参照）。ローカル開発・ベータビルドではデフォルト値、本番ビルドのみ `DEPLOY_TARGET=production` を明示する。

## 役割分担と導線マップ

| 層 | 役割 | URL |
|------|------|-----|
| WP記事 | 読み物・解説・SEO着地点（第8・9世代まとめ、個別記事など） | `pokebros.net` 配下の個別記事 |
| summary-pages（pokebros-tools） | 世代・大会・special-forms・type-stats・個別詳細ページの SEO 正本 | `https://www.pokebros.net/distribution/gen1-2/` 〜 `/gen9/`、`/champions-eventpokemon/` など |
| 本アプリ（本リポジトリ） | 検索・タイムライン・比較・お気に入り・所持チェックリスト（ツール層） | ①ベータ: `https://boitoshi.github.io/pokemon-distribution-app/` ／ ②本番: `https://www.pokebros.net/distribution/search/` |

- 本アプリの世代別まとめページ（`gen/[generation].astro`）・Championsページ（`champions.astro`）は削除済み。検索UIヘッダー下のリンク帯（`src/data/gen-guides.json` で管理）から summary-pages / WP記事へ外部リンクで誘導する
- 個別ポケモンページ（`/pokemon/[id]`）は残すが、SEO を summary-pages 側に一本化するため**常時 `noindex`**
- ベータ（GitHub Pages）ビルドは全ページ `noindex`。本番ビルドは `pokemon/[id]` のみ `noindex`、それ以外（トップ・タイムライン）はインデックス対象

### 世代リンク帯の運用状況（2026-08-03時点）

summary-pages（`pokebros.net/distribution/` 配下のまとめページ）は**まだ本番FTPデプロイされていない**。存在しないURLにリンクすると WordPress が似たスラッグの個別記事へ勝手にリダイレクトしてしまうため、現状リンク帯に表示できるのは第8世代（WP記事 `/eventpokemon-genviii/`）と第9世代（WP記事 `/eventpokemon-gen9/`）のみ。第1〜7世代とChampionsは `src/data/gen-guides.json` の `externalUrl` を空にして非表示にしてある。

summary-pages を pokebros-tools の `deploy-ftp.yml` でFTPデプロイした後、`gen-guides.json` の該当エントリの `plannedUrl` を `externalUrl` にコピーしてリンクを有効化すること。

---

## ①ベータ: GitHub Pages

### 初回セットアップ

1. リポジトリの Settings → Pages → Source を **GitHub Actions** に設定
2. `.github/workflows/deploy-pages.yml` が main への push（または手動 `workflow_dispatch`）で `npm run lint` → `npm run smoke` → `npm run build` → Pages へデプロイを実行

### 確認

`https://boitoshi.github.io/pokemon-distribution-app/` にアクセスして確認。全ページに `<meta name="robots" content="noindex">` が入っていることを確認する（意図的な挙動）。

---

## ②本番: ConoHa FTP（案A・現行の参考手順）

将来的に summary-pages と同様の `deploy-ftp.yml`（GitHub Actions による自動デプロイ）を導入予定だが、現状は以下の手動手順で運用する。

### サイト情報

| 項目 | 値 |
|------|-----|
| 本番URL | https://www.pokebros.net/distribution/search/ |
| サーバー | ConoHa |
| 配置先 | `public_html/distribution/search/` |

### ディレクトリ構成

```
ConoHaサーバー
└── public_html/
    ├── (WordPressブログ: pokebros.net)
    │   ├── wp-content/
    │   ├── wp-admin/
    │   └── ...
    │
    └── distribution/
        ├── (summary-pages: gen1-2/, gen3/, ..., champions-eventpokemon/ など)
        │
        └── search/           ← 本アプリの dist/ の中身をここに配置
            ├── index.html
            ├── pokemon.json
            └── _astro/
```

### 初回デプロイ

#### 1. ビルド

```bash
npm run build:prod
```

`DEPLOY_TARGET=production` で `dist/` フォルダが生成される（`base` は `/distribution/search`）。

#### 2. アップロード

FTP/SFTP で `dist/` の **中身** を `public_html/distribution/search/` にアップロード。

```
dist/
├── index.html       → public_html/distribution/search/index.html
├── pokemon.json     → public_html/distribution/search/pokemon.json
└── _astro/          → public_html/distribution/search/_astro/
```

#### 3. 動作確認

https://www.pokebros.net/distribution/search/ にアクセスして確認。

---

## データ更新（JSONのみ）

ビルド不要。JSONファイルのみ差し替え。

### 1. データ生成

```bash
cd ../pokemon-data && npm run build
node scripts/sync-from-pokemon-data.mjs
```

`pokemon-data` の正本（`distributions/*.json`）から `build/pokemon.json` を生成し、
`public/pokemon.json` へ pull only で同期する（件数減少ガード付き）。

### 2. アップロード

FTP/SFTP で `pokemon.json` を `public_html/distribution/search/` にアップロード（上書き）。

### 3. キャッシュクリア

ブラウザのキャッシュをクリアして確認（Ctrl+Shift+R）。

---

## UI・コード変更時

再ビルドが必要。

### 1. ローカルで確認

```bash
npm run dev        # 開発サーバー起動
npm run build       # ベータ（GitHub Pages）ターゲットでビルド確認
npm run build:prod  # 本番（ConoHa）ターゲットでビルド確認
npm run preview     # ビルド結果確認
```

### 2. アップロード（本番）

`npm run build:prod` の `dist/` の中身を `public_html/distribution/search/` にアップロード（上書き）。

---

## FTP設定例（本番）

| 項目 | 値 |
|------|-----|
| ホスト | （ConoHaコントロールパネルで確認） |
| ユーザー名 | （ConoHaコントロールパネルで確認） |
| ポート | 21（FTP）または 22（SFTP） |
| ディレクトリ | `/public_html/distribution/search/` |

### おすすめFTPクライアント

- FileZilla（無料）
- Cyberduck（無料）
- WinSCP（Windows、無料）

---

## トラブルシューティング

### 画像やCSSが読み込まれない

`astro.config.mjs` の `base` 設定（`DEPLOY_TARGET` による切替）を確認:

```js
const isProd = process.env.DEPLOY_TARGET === 'production';

export default defineConfig({
  site: isProd ? 'https://www.pokebros.net' : 'https://boitoshi.github.io',
  base: isProd ? '/distribution/search' : '/pokemon-distribution-app',
});
```

本番用にビルドし忘れて `npm run build`（ベータターゲット）の成果物を ConoHa にアップロードすると、base パスが `/pokemon-distribution-app` のままになり画像・CSS が読み込めない。必ず `npm run build:prod` を使うこと。

### JSONが更新されない

1. ブラウザキャッシュをクリア
2. JSONファイルのアップロード先が正しいか確認
3. ファイル名が `pokemon.json` か確認（大文字小文字注意）

### 404エラーが出る

- （本番）`distribution/search` フォルダが `public_html` 直下にあるか確認
- `index.html` が `search` フォルダ内にあるか確認
