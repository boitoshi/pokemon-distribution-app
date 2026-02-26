# Pokemon Distribution App - セッション間メモリ

## プロジェクト概要
- Astro製の静的サイト。配信ポケモン情報を検索できる日本語サイト
- 本番URL: https://www.pokebros.net/distribution/
- ベースパス: `/distribution`（`astro.config.mjs`で設定）
- ホスティング: ConoHaサーバー（`public_html/distribution/`）

## 重要ファイル
- `src/pages/index.astro` — メインページ。検索・無限スクロール・お気に入り・比較・CSVエクスポート等すべてここ
- `src/pages/pokemon/[id].astro` — 個別ポケモンページ
- `src/components/SearchBox.astro` — 検索UI
- `src/components/PokemonCard.astro` — カード表示・モーダル
- `src/layouts/Layout.astro` — 共通レイアウト・グローバルCSS
- `public/pokemon.json` — 配信ポケモンデータ（スプレッドシートからGASでエクスポート）
- `scripts/export-to-json.gs` — GASエクスポートスクリプト

## ドキュメント
- `docs/data-design.md` — データ設計書（カラム定義、GASエクスポート仕様）
- `docs/deploy.md` — デプロイ手順（FTP/SFTP）
- `docs/features.md` — 機能一覧・実装状況・今後の課題
- `SECURITY.md` — セキュリティチェック結果（2026-02-06 実施済み）
- `CLAUDE.md` — Claude Code開発ガイド（キャラクター設定含む）

## キャラクター設定（CLAUDE.md参照）
- メイン（お姉ちゃん）: はつらつ・肯定的・「〜だよ」「〜じゃん」口調
- サブエージェント（後輩ちゃん）: 「〜です！」「やってみます！」「お姉ちゃん、終わりました！」

## 技術的決定事項

### データ構造
- `moves` / `ribbons` は配列形式推奨（後方互換で `move1`〜`move4` も対応）
- `ot` は単一文字列または言語別オブジェクト（`{JPN, ENG, FRE, ...}`）
- `ivs` は文字列パターン（"6V"等）または個別値オブジェクト（`{hp, atk, def, spa, spd, spe}`）
- あかしは `ribbons` 配列に格納。名前が「あかし」で終わるもので自動判定
- `managementId` 形式: `[世代2桁][連番3桁]`（例: `06001`）

### ゲーム名略称マッピング
| 正式名 | 略称 |
|--------|------|
| ソード, シールド | 剣盾 |
| ブリリアントダイヤモンド, シャイニングパール | BDSP |
| Pokémon LEGENDS アルセウス | LA |
| スカーレット, バイオレット | SV |
| Pokémon LEGENDS Z-A | ZA |

### ゲーム固有表示
- キョダイマックス: ソード/シールドのみ
- テラスタイプ: スカーレット/バイオレットのみ
- オヤブン: アルセウス/Z-Aのみ

### 画像パス
- 関数: `getPokemonImageUrl()`, `getBallImageUrl()`, `getRibbonImageUrl()`
- 本番: `https://www.pokebros.net/wp-content/uploads/pokemon-assets/`
- ローカル: `/distribution/images/`
- 画像なし時: 絵文字フォールバック（⚪/🎀/🏅）

### スタイリング
- Tailwind未使用、グローバルCSSで統一（`Layout.astro`の `<style is:global>`）
- カラー: プライマリ `#1a237e`、アクセント `#1976d2`
- レスポンシブ: `@media (max-width: 768px)`

## データ更新フロー
### FTP直接更新（最速、ビルド不要）
1. GASでJSONエクスポート → FTP/SFTPで `public_html/distribution/pokemon.json` を上書き

### Gitリポジトリ経由（推奨）
1. GASでJSONエクスポート → `public/pokemon.json` を置き換え
2. `npm run build` でビルド確認 → mainブランチにプッシュ

## 実装済み機能（主要）
- 無限スクロール（IntersectionObserver、24件ずつ）
- お気に入り機能（localStorage）
- 所持チェックリスト機能（localStorage）
- コレクション統計（世代別/ゲーム別プログレスバー）
- メモ機能（保管場所・カスタムメモ）
- 比較機能（複数の配信を並べて比較）
- CSVエクスポート（CSVインジェクション対策済み）
- ダークモード切替
- URLパラメータ対応（`?shiny=1&game=スカーレット, バイオレット`等）
- 個別ポケモンページ（`/pokemon/[id]`）
- OGPメタタグ・Twitterカード
- PWA対応（manifest.json, Service Worker）

## 未実装タスク（今後の課題）
- 本番用ポケモン画像・ボール画像のサーバーアップロード（画像は準備済み）
- 入手難易度表示
- 配信タイムライン表示
- 欲しいものリスト
- ワンダーカード画像表示

## セキュリティ（2026-02-06 チェック済み）
- XSS対策: `escapeHtml()` 関数実装済み
- CSVインジェクション対策: `sanitizeCsvValue()` 実装済み
- localStorage: try-catch済み
- 総合評価: 公開可能
