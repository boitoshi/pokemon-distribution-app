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
├── data-design.md          # データ設計書（カラム定義、エクスポート手順）
└── deploy.md               # デプロイ手順

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
- **全世代共通**: region（配布地域。各国法人ごとのイベント区別に使用）

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

ConoHaサーバー（pokebros.net）にデプロイ:

- サイトURL: https://www.pokebros.net/distribution/
- ベースパス: /distribution
- 設定: `astro.config.mjs`

詳細は `docs/deploy.md` を参照。

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

## 実装済み機能

### コア機能
- [x] 個別ポケモンページ生成（`/pokemon/[id]`） → `src/pages/pokemon/[id].astro`
- [x] OGPメタタグ・Twitterカード対応 → `src/layouts/Layout.astro`
- [x] PWA対応（manifest.json, Service Worker） → `public/manifest.json`, `public/sw.js`
- [x] 関連ポケモンリンク（同ポケモン/同イベント/同地域） → `src/pages/pokemon/[id].astro`
- [x] regionフィールド全世代対応 → `docs/data-design.md`

### UI機能
- [x] ページネーション（24件/ページ） → `src/pages/index.astro`
- [x] ソート機能（日付順、図鑑No順、名前順） → `src/pages/index.astro`
- [x] お気に入り機能（localStorage使用） → `src/pages/index.astro`
- [x] CSVエクスポート機能 → `src/pages/index.astro`
- [x] ダークモード切替 → `src/pages/index.astro`
- [x] 統計ダッシュボード → `src/pages/index.astro`
- [x] 一番上に戻るボタン → `src/pages/index.astro`

### データ基盤
- [x] Googleスプレッドシートからの変換スクリプト（OT多言語対応） → `scripts/export-to-json.gs`
- [x] データ設計書 → `docs/data-design.md`
- [x] デプロイ手順書 → `docs/deploy.md`

## 今後の課題

### 画像関連（優先度：中）
- [ ] 本番用ポケモン画像の配置（画像は準備済み、サーバーアップロード待ち）
- [ ] ボール画像の配置（画像は準備済み、サーバーアップロード待ち）
- [ ] 上部へスクロールボタンのアイコン画像差し替え（現在は↑テキスト）
- [ ] リボンアイコン画像の準備（現在は🎀絵文字）

### パフォーマンス改善（優先度：低）
- [ ] 画像の遅延読み込み（lazy loading）実装
- [ ] 大量データ時の仮想スクロール検討（ページネーションで部分対応済み）

### コレクター向け追加機能（検討中）
- [ ] **所持チェックリスト機能** - お気に入りとは別に、実際に所持している配信をチェック管理
- [ ] **コレクション統計** - 世代別/地域別/配信方法別の所持率グラフ表示
- [ ] **検索条件の保存** - よく使うフィルター条件をプリセットとして保存
- [ ] **比較機能** - 複数の配信を並べて違いを比較表示
- [ ] **入手難易度表示** - 現在入手可能/過去のみ/超レアなど
- [ ] **配信タイムライン表示** - 時系列で配信を可視化
- [ ] **メモ機能** - 各配信に個人的なメモを追加（交換情報など）
- [ ] **欲しいものリスト** - 未所持で入手したい配信をマーク
- [ ] **ワンダーカード画像表示** - 配信証明書の画像を添付・表示
- [ ] **詳細フィルター** - 複数条件のAND/OR組み合わせ検索
