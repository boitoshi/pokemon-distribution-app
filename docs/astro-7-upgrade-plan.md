# Astro 7 アップグレード計画

最終調査日: 2026-09-10

## 目的

`astro@4.16.19` を Astro 7 系へ更新し、通常の依存更新では解消できなかった
production dependencies の既知脆弱性を解消する。

この文書は、Mac 上で Codex に実装を依頼するときの作業指示兼チェックリストである。
実装時は必ず最新 `main` から作業し、最初に `AGENTS.md` と `CLAUDE.md` を読むこと。

## 現状

- Astro: `4.16.19`
- TypeScript: `5.9.3`
- `@astrojs/check`: `0.9.8`
- 通常CI: Node.js 20
- GitHub Pages: Node.js 22
- 出力方式: adapterなしの静的SSG
- 通常更新後の `npm audit --omit=dev`: 4件
  - `astro`: critical
  - `sharp`: high
  - `vite`: high
  - `esbuild`: moderate
- npmが提示する解消先: `astro@7.3.2`
- Astro 7の必要Node.js: `>=22.12.0`

通常更新はPR #15で `main` に反映済み。ここで同じ通常更新をやり直さないこと。

## 今回の作業範囲

### 必須

1. Node.jsのサポート範囲を22.12以上へ統一する。
2. Astroを安定版の最新7系へ更新する。
3. Astroが直接利用する推移依存（Vite、esbuild、sharp）が安全な版へ更新されたことを確認する。
4. Astro／TypeScriptの型チェックを正式なnpm scriptとCIへ追加する。
5. lint、型チェック、smoke、beta build、production buildを実行する。
6. `npm audit --omit=dev` が0件になることを確認する。
7. 生成ページ数、主要画面、base path、Service Worker登録の回帰を確認する。

### 対象外

- UIや機能の追加・再設計
- データ仕様の変更
- `public/pokemon.json` の意図しない更新
- `nuxt-reference/` の変更
- ConoHa本番環境へのデプロイ
- 脆弱性を隠すためだけの `overrides` や監査除外
- 必要性のない依存パッケージの追加

## 事前調査で確認済みの影響

本アプリには次の機能がないため、公式移行ガイドにある多くの破壊的変更は該当しない。

- SSR、adapter、middleware、server islands、Astro Actions
- Content Collections、MDX、`Astro.glob()`
- View Transitions
- `astro:assets` の `Image` / `Picture` / `getImage()`
- Viteプラグイン、独自Rollup設定
- experimental設定
- CommonJS形式のAstro設定

### 要確認箇所

#### `define:vars`

以下の3ファイルで利用している。

- `src/layouts/Layout.astro`
- `src/pages/index.astro`
- `src/pages/timeline.astro`

Astro 7ではRustコンパイラとHTML空白処理が変わる。次の値が正しくJavaScriptへ渡り、
ブラウザ上の機能が動くことを確認する。

- `swPath`
- `baseUrl`
- `teraSlugs`

#### 動的ルート

`src/pages/pokemon/[id].astro` の `getStaticPaths()` は
`managementId` を文字列のparamsとして返す。Astro 6以降で数値paramsが不可になる変更には
該当しない見込みだが、全ページが欠落なく生成されることを確認する。

#### `import.meta.env.BASE_URL`

複数箇所でbase pathの組み立てに使用している。Astro 6以降ではenv値のインライン化方式が
変わるため、betaとproductionの両方でURLを確認する。

- beta: `/pokemon-distribution-app/`
- production: `/distribution/search/`

#### HTML出力

Astro 7ではRustコンパイラと `compressHTML: "jsx"` 相当の空白処理が既定になる。
レイアウト崩れ、インラインscript、空白依存の表示がないかを確認する。

## 想定する変更ファイル

- `package.json`
  - Astro 7系へ更新
  - `check` scriptとして `astro check` を追加
  - 必要なら `engines.node` に `>=22.12.0` を追加
- `package-lock.json`
- `.github/workflows/ci.yml`
  - Node.js 20を22へ更新
  - `npm run check` を追加
- `.github/workflows/deploy-pages.yml`
  - 既にNode.js 22。22.12以上が保証される指定か確認
  - `npm run check` を追加するか通常CIとの役割を整理
- `.nvmrc`
  - プロジェクトのNode.js系統を22へ固定する場合のみ追加
- Astro 7で実際にエラーになったソースファイル
  - 推測で変更せず、型チェック・build・ブラウザ確認で必要になった最小箇所だけ修正する

## 推奨作業手順

```bash
git switch main
git pull --ff-only
git status --short
git switch -c chore/upgrade-astro-7

nvm install 22
nvm use 22
node --version
npm --version

npx @astrojs/upgrade
npm install
npm audit --omit=dev
npm run lint
npm run check
npm run smoke
npm run build
npm run build:prod
```

`npx @astrojs/upgrade` が不要なパッケージ変更や想定外のメジャー更新を提示した場合は、
そのまま受け入れず差分を確認すること。公式integrationは現在ほぼ使っていないため、
必要であれば `npm install astro@^7` による手動更新でもよい。

## 検証項目

### 自動検証

- [ ] `npm ci --ignore-scripts` または通常CIと同条件のインストールが成功
- [ ] `npm audit --omit=dev` が0件
- [ ] `npm run lint` が成功
- [ ] `npm run check` が成功
- [ ] `npm run smoke` が成功し、データ件数が意図せず変わっていない
- [ ] `npm run build` が成功
- [ ] `npm run build:prod` が成功
- [ ] beta buildとproduction buildの生成ページ数が更新前と一致
- [ ] `git diff --check` が成功
- [ ] 変更ファイルが作業範囲内だけ

### ブラウザ確認

- [ ] トップページが表示される
- [ ] 検索、絞り込み、無限スクロールが動作する
- [ ] モーダル表示、比較、お気に入り／所持状態が動作する
- [ ] タイムラインが表示・操作できる
- [ ] 個別ページが表示される
- [ ] Pokémon Championsのデータも検索・個別ページに含まれる
- [ ] 画像URLがbeta／productionの各base pathで正しい
- [ ] Service Workerの登録URLが正しい
- [ ] コンソールに新しいエラーがない
- [ ] beta環境の全ページ `noindex` と、productionの個別ページ `noindex` が維持される

## 完了条件

- Astro 7系とNode.js 22.12以上で全検証が成功する。
- production dependenciesの監査結果が0件になる。
- 既存機能、データ件数、生成ページ、URL、SEO設定に意図しない差分がない。
- CIが成功する。
- PR本文に更新バージョン、破壊的変更への対応、検証結果を記載する。

すべて満たした場合のみcommit、push、PR作成、マージまで進める。
仕様判断や広範なソース修正が必要になった場合は、無理にマージせず具体的な選択肢を報告する。

## 参照資料

- Astro v5移行ガイド: <https://docs.astro.build/en/guides/upgrade-to/v5/>
- Astro v6移行ガイド: <https://docs.astro.build/en/guides/upgrade-to/v6/>
- Astro v7移行ガイド: <https://docs.astro.build/en/guides/upgrade-to/v7/>
- 通常更新PR: <https://github.com/boitoshi/pokemon-distribution-app/pull/15>
