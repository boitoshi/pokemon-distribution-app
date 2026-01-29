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

docs/
└── data-design.md          # データ設計書（カラム定義、エクスポート手順）

scripts/
└── export-to-json.gs       # GASエクスポートスクリプト

nuxt-reference/             # 参考用Nuxt版（修正不要）
```

## パスエイリアス

- `@/*` → `src/*`

## 重要な技術的決定

### データ構造

`pokemon.json` の各エントリには以下のフィールドが含まれる:

- **必須**: managementId, pokemonName, dexNo, generation, game, eventName, distributionMethod, distributionLocation, startDate
- **オプション**: shiny, endDate, ot, trainerId, ball, level, ability, nature, gigantamax, teraType, isAlpha, heldItem, moves[], ribbons[], notes, postUrl
- **第1-7世代で重要**: region（配信地域。3DSリージョンロック対応）

詳細なカラム設計は `docs/data-design.md` を参照。

### moves/ribbons の互換性

- 配列形式（推奨）: `moves: ["わざ1", "わざ2"]`
- カラム形式（後方互換）: `move1`, `move2`, `move3`, `move4`

### ゲーム固有の表示ロジック

- **キョダイマックス**: ソード/シールドのみ表示
- **テラスタイプ**: スカーレット/バイオレットのみ表示
- **オヤブン**: アルセウス/Z-Aのみ表示

### OT（親名）の多言語対応

```json
// 単一言語（後方互換）
"ot": "サトシ"

// 複数言語（オブジェクト形式）
"ot": {
  "ja": "サトシ",
  "en": "Ash",
  "la": "Satoshi"  // ラテン語（第9世代Z-A以降）
}
```

### ポケモン画像

- 検証用: PokéAPI (`https://raw.githubusercontent.com/.../official-artwork/{dexNo}.png`)
- 本番用: 自前画像（`public/images/pokemon/{dexNo}.png`）
- `getPokemonImageUrl()` 関数で切り替え

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

1. Googleスプレッドシートを開く
2. メニュー「Pokemon Export」→「JSONエクスポート」を実行
3. 出力された `pokemon.json` をダウンロード
4. `public/pokemon.json` を置き換え
5. `npm run build` でビルド確認
6. mainブランチにプッシュ

詳細は `docs/data-design.md` を参照。

## 注意事項

- `nuxt-reference/` は参考用。直接修正しない

## Claude Code ワークフロー

### モデル使い分け

- **プランニング・設計**: Opus を使用
- **コード実装**: Sonnet を使用（Task toolで `model: "sonnet"` を指定）

### Web確認

- 外部サイトのUI確認には **Playwright MCP** を使用
- 静的HTMLの取得のみなら WebFetch でも可

## UI機能（実装済み）

### 検索機能

- **基本検索**: ポケモン名・イベント名のテキスト検索
- **セレクトボックス**: 世代、ゲーム、配信方法で絞り込み
- **詳細条件（開閉式）**:
  - ✨ 色違い
  - 🔷 キョダイマックス
  - 👑 オヤブン
  - 🎯 特別な技あり
  - 🎁 持ち物あり
  - 🎀 リボンで絞る（セレクトボックス、具体的なリボン名で検索）
- **クリアボタン**: 全ての検索条件をリセット
- **URLパラメータ対応**: `?shiny=1&moves=1&ribbon=きょうせいリボン` など

### 素早い絞り込み

- 検索結果を即座に絞り込めるボタン（統計エリア内）
- PC: 通常表示
- スマホ:
  - 上部固定（sticky）
  - 下部にも固定表示（アイコン+テキスト縦並び）
  - 一番上に戻るボタン（右下、300px以上スクロールで表示）

### レスポンシブ対応

- PC: 横並びレイアウト、ホバー効果
- スマホ:
  - 縦並び・タップしやすいサイズ
  - 検索実行時に結果エリアへ自動スクロール
  - チェックボックス変更時はスクロールしない
  - input要素のfont-size 16px（iPhoneの自動ズーム防止）

### ヘッダー

- 画面幅いっぱいに表示（角丸なし）
- スクロールしても固定されない

## 今後の課題

### データ関連
- [x] Googleスプレッドシートからの変換スクリプト（OT多言語対応） → `scripts/export-to-json.gs`
- [x] データ設計書 → `docs/data-design.md`
- [ ] 本番用ポケモン画像の準備と配置
- [ ] ボール画像の準備と配置

### UI改善
- [ ] 上部へスクロールボタンのアイコン画像差し替え（現在は矢印テキスト）
- [ ] リボンアイコン画像の準備（現在は🎀絵文字）
- [ ] ポケモンカード一覧のページネーション（大量データ対応）
- [ ] 検索結果のソート機能（日付順、図鑑No順など）
- [ ] お気に入り機能（localStorage使用）

### パフォーマンス
- [ ] 大量データ時の仮想スクロール検討
- [ ] 画像の遅延読み込み（lazy loading）
