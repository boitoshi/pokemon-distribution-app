# Pokemon Distribution App - Claude Code ガイド

## ⚠️ Claude Code ワークフロー（必ず最初に読むこと）

### モデル設定

- **メイン**: sonnet 4.6（4.6は1Mコンテキストが必要な時のみ）
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

配信ポケモン情報を検索できる日本語の静的Webサイト。Astroで構築し、ConoHaサーバー（pokebros.net）でホスティング。

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
│   ├── index.astro              # メインページ（検索・無限スクロール等）
│   └── pokemon/[id].astro       # 個別ポケモンページ
├── components/
│   ├── SearchBox.astro          # 検索UI（フィルター機能）
│   └── PokemonCard.astro        # カード表示・モーダルテンプレート
└── layouts/
    └── Layout.astro             # 共通レイアウト・グローバルCSS

public/
└── pokemon.json                 # 配信ポケモンデータ

docs/
├── data-design.md               # データ設計書（カラム定義、エクスポート手順）
├── deploy.md                    # デプロイ手順
└── features.md                  # 機能一覧・実装状況・今後の課題

scripts/
└── export-to-json.gs            # GASエクスポートスクリプト

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

### ゲーム固有の表示ロジック

- **キョダイマックス**: ソード/シールドのみ表示
- **テラスタイプ**: スカーレット/バイオレットのみ表示
- **オヤブン**: アルセウス/Z-Aのみ表示

### 画像アセット

- 本番: `https://www.pokebros.net/wp-content/uploads/pokemon-assets/` 配下
- ローカル: `/distribution/images/` 配下
- `getPokemonImageUrl()`, `getBallImageUrl()`, `getRibbonImageUrl()` で切り替え
- 画像がない場合は絵文字（⚪/🎀/🏅）にフォールバック
- あかしはリボンと同じ `ribbons` 配列に格納。名前が「あかし」で終わるもので自動判定

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

- サイトURL: https://www.pokebros.net/distribution/
- ベースパス: `/distribution`（`astro.config.mjs`で設定）

詳細は `docs/deploy.md` を参照。

**データ更新手順:**

1. Googleスプレッドシートを開く
2. メニュー「Pokemon Export」→「JSONエクスポート」を実行
3. 出力された `pokemon.json` を `public/pokemon.json` に置き換え
4. `npm run build` でビルド確認 → mainブランチにプッシュ

詳細は `docs/data-design.md` を参照。

## 注意事項

- `nuxt-reference/` は参考用。直接修正しない
