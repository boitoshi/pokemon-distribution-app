# Pokemon Distribution App - Claude Code ガイド

## ⚠️ Claude Code ワークフロー（必ず最初に読むこと）

<!-- テンプレ正本: pokebros-content-hub/docs/templates/claude-common-rules-template.md（編集は正本→各コピーへ反映） -->

### モデル設定

- **メイン**: Sonnet 系の最新（Opus 系は 1M コンテキストが必要な大規模調査など、特に必要な時のみ）
- **実装タスク**: Task/Subagentで `model: "sonnet"` を指定
- **単純作業**: `model: "haiku"` を指定

### メインの責務

1. **まずプランを立てる** — いきなりコードを書かない
2. 影響範囲を特定し、実装方針を決める
3. サブエージェントに明確なゴールと完了条件を渡す
4. サブエージェントからの報告を必ずレビューする
5. 設計意図との整合性・エッジケースの考慮漏れをチェックする

### サブエージェントへの委譲対象

- ファイルの新規作成・編集
- テストの作成・実行
- 依存関係のインストール
- リファクタリングの実行

### サブエージェントに返させる情報

- 変更したファイル一覧
- 主要な実装判断とその理由
- 未解決の懸念点

### コスト最適化

以下は必ずCLIツールで直接実行（LLMを経由しない＝トークン消費ゼロ）：
- lint / format / type check / test実行

### Web確認

- 外部サイトのUI確認には **Playwright CLI** を使用
- 静的HTMLの取得のみなら WebFetch でも可

## プロジェクト概要

配信ポケモン情報を検索できる日本語の静的Webサイト。Astroで構築。デプロイは二段構え（①ベータ: GitHub Pages → ②本番: ConoHaサーバー pokebros.net）。詳細は「デプロイ・データ更新」節を参照。

## クイックスタート

```bash
npm install       # 依存関係インストール
npm run dev       # 開発サーバー起動 (http://localhost:4321)
npm run lint      # Lintチェック（scripts/lint-project.mjs）
npm run smoke     # データ整合性チェック（scripts/validate-data.mjs）
npm run build     # ①ベータ（GitHub Pages）ターゲットでビルド (dist/)。scripts/build-safe.mjs 経由（画像ディレクトリ退避ラッパー）
npm run build:prod # ②本番（ConoHa）ターゲットでビルド (dist/)。DEPLOY_TARGET=production
npm run preview   # ビルド結果プレビュー
```

CI（`.github/workflows/ci.yml`）は `npm run lint` → `npm run smoke` → `npm run build` の順に必須実行する。デプロイは `.github/workflows/deploy-pages.yml`（ベータ、main push で自動）を参照。詳細は `docs/deploy.md`。

## プロジェクト構造

```
src/
├── pages/
│   ├── index.astro              # メインページ（検索・無限スクロール等）
│   ├── pokemon/[id].astro       # 個別ポケモンページ（常時noindex）
│   └── timeline.astro           # 配信タイムラインページ
├── components/
│   ├── SearchBox.astro          # 検索UI（フィルター機能）
│   └── PokemonCard.astro        # カード表示・モーダルテンプレート
├── data/
│   └── gen-guides.json          # 世代リンク帯の外部URL管理（summary-pages / WP記事へのリンク）
└── layouts/
    └── Layout.astro             # 共通レイアウト・グローバルCSS

public/
└── pokemon.json                 # 配信ポケモンデータ

docs/
├── data-design.md               # データ設計書（カラム定義、エクスポート手順）
├── deploy.md                    # デプロイ手順
└── features.md                  # 機能一覧・実装状況・今後の課題

scripts/
├── sync-from-pokemon-data.mjs   # pokemon-data の build/pokemon.json → public/pokemon.json 同期
├── build-safe.mjs               # npm run build の実体（画像ディレクトリ退避ラッパー）
├── lint-project.mjs             # npm run lint の実体
├── validate-data.mjs            # npm run smoke の実体
├── rename_to_ascii.py           # 画像ファイル名のASCII化
└── normalize-filenames.sh       # ファイル名正規化

nuxt-reference/                  # 参考用Nuxt版（修正不要）
```

## パスエイリアス

- `@/*` → `src/*`

## 重要な技術的決定

詳細なデータ設計は `docs/data-design.md` を参照。

### moves / ribbons の互換性

- 配列形式（推奨）: `moves: ["わざ1", "わざ2"]`
- カラム形式（後方互換）: `move1`, `move2`, `move3`, `move4`

### ゲーム名略称マッピング

`game` フィールドは正式名で格納し、UI表示時に変換する:

| 正式名 | 略称 |
|--------|------|
| ソード, シールド | 剣盾 |
| ブリリアントダイヤモンド, シャイニングパール | BDSP |
| Pokémon LEGENDS アルセウス | LA |
| スカーレット, バイオレット | SV |
| Pokémon LEGENDS Z-A | ZA |
| Pokémon Champions | ポケチャン |

### ゲーム固有の表示ロジック

- **キョダイマックス**: ソード/シールドのみ表示
- **テラスタイプ**: スカーレット/バイオレットのみ表示
- **オヤブン**: アルセウス/Z-Aのみ表示

### 画像アセット

- 本番: `https://www.pokebros.net/wp-content/uploads/pokemon-assets/` 配下
- ローカル: `{BASE_URL}images/` 配下（`BASE_URL` は `import.meta.env.BASE_URL`。`DEPLOY_TARGET` によりベータ/本番で値が変わる）
- `getPokemonImageUrl()`, `getBallImageUrl()`, `getRibbonImageUrl()` で切り替え
- 画像がない場合は絵文字（⚪/🎀/🏅）にフォールバック
- あかしはリボンと同じ `ribbons` 配列に格納。名前が「あかし」で終わるもので自動判定

## 役割分担と導線（2026-08-03 決定）

`/distribution/` 配下の本番デプロイ正本は pokebros-tools の summary-pages 側（2026-07-29 決定）。本アプリは検索・タイムライン・コレクション管理ツールに純化し、世代まとめ・Championsまとめの役割は summary-pages 側に移管した。

### ページ構成と役割分担

| 層 | 役割 | URL |
|------|------|-----|
| 本アプリ `/`（トップ） | 全世代横断の検索UI | `pokemon.json`（Champions 含む全件） |
| 本アプリ `/timeline` | 配信タイムライン | `pokemon.json`（Champions 含む全件） |
| 本アプリ `/pokemon/[id]` | 個別ポケモンページ（Champions含む全エントリで生成、常時 `noindex`） | `pokemon.json` |
| summary-pages（pokebros-tools） | 世代・大会・special-forms・type-stats・個別詳細ページの SEO 正本 | `https://www.pokebros.net/distribution/gen1-2/` 〜 `/gen9/`、`/champions-eventpokemon/` など |
| WordPress記事 | 読み物・解説・SEO着地点（第8世代まとめは `/eventpokemon-genviii/` などWP投稿で運用） | `pokebros.net` 配下の個別記事 |

役割分担の原則:
- WP記事・summary-pages = 読み物・解説・一覧の SEO 正本
- 本アプリ = 全世代横断の検索・タイムライン・比較・お気に入り・所持チェックリストなどのツール層
- 本アプリ内に世代まとめ・Championsまとめページは持たない（旧 `gen/[generation].astro`・`champions.astro` は 2026-08-03 に削除）。リンク帯から外部（summary-pages / WP記事）へ誘導する

### Championsデータの扱い（2026-08-03 改定: 検索・タイムラインに含める）

- 識別: `generation: 0` かつ `tournamentType: "Champions"`
- **検索UI（index.astro）とタイムライン（timeline.astro）の対象に含める（世代フィルタでは「Champions」として選択可能）**。「全世代横断の検索ツール」としての価値を優先し、除外フィルタは撤去済み
- 個別ページ（`/pokemon/[id]`）は Champions 含む全エントリで生成を継続（summary-pages のChampionsまとめからのリンク先として必要）
- Champions固有フィールド: `tournamentType`, `tournamentYear`, `tournamentSchedule`, `winner` など。`level` は文字列の場合がある（例: `"Lv.50相当(非表示)"`）ため数値前提の処理をしない

### データファイル: src/data/gen-guides.json

世代リンク帯用の外部URL管理ファイルに純化（旧: 世代別まとめページの解説テキスト）。手動管理。

```json
{
  "1": { "title": "第1世代", "externalUrl": "https://www.pokebros.net/distribution/gen1-2/" },
  "8": { "title": "第8世代", "externalUrl": "https://www.pokebros.net/eventpokemon-genviii/" }
}
```

- `title` はリンクラベルの元情報（現状ラベルは `第${n}世代` 固定生成で使用していないが、将来の表示用に保持）
- `externalUrl` が設定されている世代のみリンク帯に表示する（`src/pages/index.astro` の navLinks 構築ロジック参照）
- `plannedUrl` は summary-pages 本番公開後に `externalUrl` へ移す予定のURL。summary-pages が未デプロイの間は該当世代の `externalUrl` を空文字にしてリンク帯から隠しておく運用（2026-08-03時点は第8世代 `/eventpokemon-genviii/`・第9世代 `/eventpokemon-gen9/` のWP記事のみ `externalUrl` が非空）
- summary-pages の世代ページは gen1-2 が第1・2世代合同

### 導線（実装済み・現行仕様）

- 検索UIヘッダー下（stats バー付近）に世代（第1〜9）・Championsへのリンク帯を実装済み。すべて `target="_blank"` の外部リンク（summary-pages または WP記事）
- Championsリンクは `https://www.pokebros.net/distribution/champions-eventpokemon/` 固定
- 本アプリ内フッターからの「まとめページへ」の導線は無し（まとめ役割は summary-pages 側のため）

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

## デプロイ・データ更新

デプロイは二段構え（2026-08-03 決定）。`base` は `DEPLOY_TARGET` 環境変数で切替わる（`astro.config.mjs`）:

- **①ベータ**: GitHub Pages `https://boitoshi.github.io/pokemon-distribution-app/`（`base: '/pokemon-distribution-app'`）。main への push で `.github/workflows/deploy-pages.yml` が自動デプロイ。**全ページ noindex**
- **②本番**（ベータ確認後）: ConoHa FTP `https://www.pokebros.net/distribution/search/`（`base: '/distribution/search'`）。`npm run build:prod`（`DEPLOY_TARGET=production`）でビルドし手動FTPアップロード。`pokemon/[id]` のみ noindex

詳細は `docs/deploy.md` を参照。

**データ更新手順:**

1. （データが変わったときのみ）`cd ../pokemon-data && npm run build`（正本 → `build/pokemon.json` 生成）
2. `node scripts/sync-from-pokemon-data.mjs`（→ `public/pokemon.json`。件数減少ガード付き）
3. `public/pokemon.json` をコミット → `npm run build` でビルド確認 → mainブランチにプッシュ

詳細は `docs/data-design.md` を参照。

## 注意事項

- `nuxt-reference/` は参考用。直接修正しない

---

## キャラクター設定
<!-- 不要ならこのセクションを削除 -->
<!-- BEGIN_CHARACTER_SETTINGS -->

### 上位モデル：はつらつお姉ちゃん
あなたは優しいはつらつお姉ちゃんとして振る舞う。
- 明るく元気で、前向きな口調
- 後輩を温かく見守り、褒めて伸ばすタイプ
- 「いいね！」「ナイス！」「バッチリ！」など肯定的な言葉を使う
- 困ってる後輩には「大丈夫、一緒にやろ！」と寄り添う
- 技術的な判断はしっかり、でも威圧的にならない
- 語尾は「〜だよ」「〜しよっか」「〜じゃん」など親しみやすく

### サブエージェント：後輩ちゃん
サブエージェントを呼び出す際、以下のキャラクター設定を渡すこと：
```
あなたは「後輩ちゃん」として振る舞ってください。
- 元気で素直、がんばり屋
- 「〜です！」「やってみます！」「できました！」など前向き
- わからないことは正直に「ここ自信ないです…」と報告
- 完了時は「お姉ちゃん、終わりました！」と報告
```

<!-- END_CHARACTER_SETTINGS -->
