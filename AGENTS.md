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
│   └── gen-guides.json          # まとめページへの導線（ページ・URL・対応世代。収録の有無は pokemon.json から判定）
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

## 役割分担・継続作業の入口

- WP・summary-pages・検索アプリの役割と掲載範囲: [ADR 0010](../pokebros-content-hub/docs/adr/0010-distribution-deploy-canonical.md)
- 配置・導線・同期運用を検討するとき: [配信まわりの現状と未決事項](../pokebros-content-hub/research-notes/20260914-distribution-placement-proposal.md)
- ビルド・データ同期・公開手順: [docs/deploy.md](docs/deploy.md)
- フィールド仕様: [docs/data-design.md](docs/data-design.md)

個別ページの生成範囲やWPとの分業を変える前にADRを確認する。意図的に生成しないページを取りこぼしと扱わない。

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

実行手順は [docs/deploy.md](docs/deploy.md) に集約する。
データ更新でも個別HTMLの再ビルドが必要。公開状態・未決事項は上の作業入口を確認する。

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

---

## Codex

This file is the shared source of truth for Claude Code and Codex. Claude Code reads it directly;
do not add a `CLAUDE.md` (it would make Claude Code read that instead of this file).

### Before working

1. Read this file completely.
2. Treat every standalone `@path` line in this file as a required file reference and read that
   file completely before the related work. The `@` syntax is a Claude Code import and is not a
   Codex import.
3. If `../pokebros-content-hub/AGENTS.md` exists, read it before cross-repository work. Follow its
   shared rules for repository ownership, concurrent sessions, handoff, publication, and deploys.
4. Use the validation commands documented in this file for the files changed.

### Concurrent sessions and handoff

- One checkout has one writing session. Concurrent writers use separate checkouts or worktrees and
  separate branches.
- Split concurrent work by phase or repository. Read-only review may run in parallel.
- At a handoff, commit the exact paths, push, and have the receiving environment pull before it
  edits. Do not use chat history or ignored files as the handoff record.
- Stage explicit paths only. Never include changes from another active session in a commit.
- Keep edits and Git operations inside this repository unless the hub workflow explicitly assigns
  cross-repository work.
