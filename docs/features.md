# 機能一覧・実装状況・今後の課題

## UI機能

### 検索機能

- **基本検索**: ポケモン名・イベント名のテキスト検索
- **セレクトボックス**: 世代（Championsも「Champions」として選択可）、配信方法で絞り込み
- **タグボタン複数選択**: ゲーム（複数同時選択可）
- **詳細条件（開閉式）**:
  - ✨ 色違い
  - 🔷 キョダイマックス
  - 👑 オヤブン
  - 🎯 特別な技あり
  - 🎁 持ち物あり
  - 🎀 リボンで絞る（複数選択・AND/OR切替、具体的なリボン名で検索）
- **クリアボタン**: 全ての検索条件をリセット
- **URLパラメータ対応**: `?shiny=1&moves=1&ribbon=きょうせいリボン` または `?game=スカーレット, バイオレット&ribbon=クラシックリボン` など

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

---

## 実装済み機能

### コア機能
- [x] 個別ポケモンページ生成（`/pokemon/[id]`） → `src/pages/pokemon/[id].astro`
- [x] OGPメタタグ・Twitterカード対応 → `src/layouts/Layout.astro`
- [x] PWA対応（manifest.json, Service Worker） → `public/manifest.json`, `public/sw.js`
- [x] 関連ポケモンリンク（同ポケモン/同イベント/同地域） → `src/pages/pokemon/[id].astro`
- [x] regionフィールド全世代対応 → `docs/data-design.md`
- [x] 2026-08-03 削除: 世代別まとめページ（旧 `/gen/[generation]`）・Championsページ（旧 `/champions`）。役割を pokebros-tools の summary-pages へ移管し、本アプリはリンク帯から外部誘導する純粋なツール層に純化
- [x] 世代・Championsへの導線リンク帯（検索UIヘッダー下、`src/data/gen-guides.json` の `externalUrl` を使った summary-pages / WP記事への外部リンク） → `src/pages/index.astro`
- [x] 個別ポケモンページは常時 `noindex`（SEOは summary-pages に一本化） → `src/pages/pokemon/[id].astro`

### UI機能
- [x] 無限スクロール（24件ずつ追加読み込み、IntersectionObserver使用） → `src/pages/index.astro`
- [x] ソート機能（日付順、図鑑No順、名前順） → `src/pages/index.astro`
- [x] お気に入り機能（localStorage使用） → `src/pages/index.astro`
- [x] ダークモード切替 → `src/pages/index.astro`
- [x] 統計ダッシュボード → `src/pages/index.astro`
- [x] 一番上に戻るボタン → `src/pages/index.astro`
- [x] 比較機能（複数の配信を並べて違いを比較） → `src/pages/index.astro`

### データ基盤
- [x] 配信データ正本を pokemon-data リポジトリへ一本化 → `scripts/sync-from-pokemon-data.mjs`（旧 GAS `export-to-json.gs` は 2026-07 引退・削除）
- [x] データ設計書 → `docs/data-design.md`
- [x] デプロイ手順書 → `docs/deploy.md`
- [x] デプロイ二段構え（① ベータ = GitHub Pages `https://boitoshi.github.io/pokemon-distribution-app/` 自動デプロイ・全ページ noindex → ② 本番 = ConoHa FTP `https://www.pokebros.net/distribution/search/`、`npm run build:prod`）→ `astro.config.mjs`, `.github/workflows/deploy-pages.yml`, `docs/deploy.md`

---

## 今後の課題

### 画像・アイコン関連（優先度：中、FTP作業はアップロード可能時にまとめて実施）
- [ ] 本番用ポケモン画像の配置（画像は準備済み、サーバーアップロード待ち）
- [ ] ボール画像の配置（アップ済みの可能性あり。FTP可能時にサーバー側を確認）
- [x] リボン・あかし画像（サーバーアップ済み。本番アセットURL参照で表示される）
- [ ] UIアイコンの画像差し替え: キョダイマックス🔷・テラスタイプ・オヤブン👑など世代別要素のバッジ（現在は絵文字/テキスト。テラスタイプ画像は `/tera/TeraGem_{タイプ名}.png` 命名でサーバー側に配置予定）
- [ ] 上部へスクロールボタンのアイコン画像差し替え（現在は↑テキスト）

### データ関連（pokemon-data 側の作業）
- [ ] **specialMoves（特別な技）の追補（手動確認枠）** — 2026-08-03 時点で計60件記録済み（第8・9世代19件の正本復元 + 第6世代34件・第7世代7件のイベント限定技〔おいわい/てをつなぐ/ハッピータイム〕機械抽出）。残るのは機械検出できない「本来覚えない技」パターン（第8世代の「ちきゅうなげリザードン」相当）の手動洗い出し。第5世代はイベント限定技の該当なし（おいわい等の登場は第6世代から）
- [x] Championsの検索対象への追加 — 対応済み(2026-08-03)。Champions(generation:0・21件)を検索UI・タイムラインの対象に含める（世代フィルタで「Champions」として選択可能）。個別ページ・summary-pagesへのリンク帯は従来通り
- [ ] **HOME配信のpokemon-data未収載** — HOME受取の配信（色違いゼラオラ等）が pokemon-data に未収載（同じデータを使う summary-pages・本アプリのどちらにも出ない。WP記事の第8世代まとめには記載あり）。**設計決定(2026-08-03): `distributions/home.json` を新設**（HOME配信は世代横断・今後増えるため独立ファイル。Champions の CH prefix にならい ID は HM 系を想定）。配信データの取得・入力はユーザーが別途実施予定。入力後に games 正本への `home` スラッグ追加・build スクリプトの DATASETS 追加・UI表示（ゲーム略称/配色）をあわせて対応する

### パフォーマンス改善（優先度：低）
- [ ] 画像の遅延読み込み（lazy loading）実装
- [ ] 大量データ時の仮想スクロール検討（無限スクロールで部分対応済み）

### コレクター向け追加機能
- [x] **所持チェックリスト機能** - お気に入りとは別に、実際に所持している配信をチェック管理 → `src/pages/index.astro`
- [x] **コレクション統計** - 世代別/ゲーム別の所持率プログレスバー表示 → `src/pages/index.astro`
- [x] **検索条件の保存** → `src/pages/index.astro`
- [x] **詳細フィルター**（ゲーム複数選択・リボン複数選択+AND/OR） → `src/pages/index.astro`
- [x] **メモ機能**（保管場所・カスタムメモ） → `src/pages/index.astro`
- [x] **配信タイムライン表示** - 別ページ（`/timeline`）で時系列を可視化 → `src/pages/timeline.astro`
  - 現在配信中セクションを最上部に固定（年またぎ問題に対応）
  - 月別sticky ヘッダー＋縦線ドット＋ボーダーカードのB+C合体デザイン
  - お気に入り・所持済みをindex.astroと共有（同じlocalStorageキー）
  - カードタップで個別ページへ遷移
  - ダークモード対応
- [ ] **入手難易度表示** - 現在入手可能/過去のみ/超レアなど
- [ ] **欲しいものリスト** - 未所持で入手したい配信をマーク
- [ ] **ワンダーカード画像表示** - 配信証明書の画像を添付・表示
