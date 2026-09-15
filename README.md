# ポケモン配信情報検索サイト

過去に配信・配布されたポケモンの情報を検索できる非公式サイトです。Astroで構築されています。

ベータ・本番のURLと実行手順は [docs/deploy.md](docs/deploy.md)、
公開状態と未決事項は [配信まわりの作業入口](../pokebros-content-hub/research-notes/20260914-distribution-placement-proposal.md)を参照してください。
本アプリは検索・タイムライン・コレクション管理を担当します。

## プロジェクト構成

```
pokemon-distribution-app/
├── src/
│   ├── pages/
│   │   ├── index.astro              # メインページ（検索・無限スクロール等）
│   │   ├── pokemon/[id].astro       # 個別ポケモンページ
│   │   └── timeline.astro           # 配信タイムラインページ
│   ├── components/
│   │   ├── SearchBox.astro          # 検索UI（フィルター機能）
│   │   └── PokemonCard.astro        # カード表示・モーダル
│   ├── data/
│   │   └── gen-guides.json          # まとめページへの導線（収録の有無は pokemon.json から判定）
│   └── layouts/
│       └── Layout.astro             # 共通レイアウト・グローバルCSS
├── public/
│   └── pokemon.json                 # 配信ポケモンデータ
├── docs/
│   ├── data-design.md               # データ設計書（カラム定義）
│   ├── deploy.md                    # デプロイ手順
│   └── features.md                  # 機能一覧・実装状況・今後の課題
├── scripts/
│   ├── sync-from-pokemon-data.mjs   # pokemon-data の build/pokemon.json → public/pokemon.json 同期
│   ├── build-safe.mjs               # npm run build の実体（画像ディレクトリ退避ラッパー）
│   ├── lint-project.mjs             # npm run lint の実体
│   ├── validate-data.mjs            # npm run smoke の実体
│   ├── rename_to_ascii.py           # 画像ファイル名のASCII化
│   └── normalize-filenames.sh       # ファイル名正規化
├── CLAUDE.md                        # Claude Code開発ガイド
├── SECURITY.md                      # セキュリティチェック結果
├── astro.config.mjs
├── package.json
└── nuxt-reference/                  # Nuxt版（参考用、修正不要）
```

## クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:4321）
npm run dev

# Lintチェック
npm run lint

# データ整合性チェック（smokeテスト）
npm run smoke

# ベータ向けビルド（scripts/build-safe.mjs 経由）
npm run build

# ビルド結果のプレビュー
npm run preview
```

CI（`.github/workflows/ci.yml`）は `npm run lint` → `npm run smoke` → `npm run build` の順に必須実行する。

## 機能

### 検索機能
- ポケモン名・イベント名でテキスト検索
- 世代、ゲーム、配信方法でフィルター
- 詳細条件（色違い、キョダイマックス、オヤブン、特別な技、持ち物、リボン）
- URLパラメータ対応（`?shiny=1&moves=1` など）

### 表示機能
- カード形式で一覧表示
- 詳細モーダル
- レスポンシブ対応（PC/スマホ）

## データ管理

### データソース（正本）

配信データの正本は **pokemon-data リポジトリ**（`distributions/gen5..gen9.json` + `champions.json`、`distributions/schema.json` 準拠）。`build-distributions.mjs` が app-runtime schema へ前方向生成した `build/pokemon.json`（件数は `build/meta.json` を参照）を、本アプリの `public/pokemon.json` へ **pull only** で同期する。

（旧構成〜2026-07: Googleスプレッドシート＋GAS `export-to-json.gs` でエクスポートしていた。正本一本化で引退・削除。世代/ハードの対応やカラム定義は `docs/data-design.md` の参考節に残す。）

配信ポケモン個別記事HTMLの生成は pokebros-content-hub の `scripts/generate_distribution_html.py` の責務（GAS引退済み）。本アプリは記事生成に関与しない。

### データ更新・デプロイ

[docs/deploy.md](docs/deploy.md) に手順を集約しています。
正本を生成し、本アプリへ同期した後、個別HTMLを含めてビルド・反映します。
JSONだけのFTP差し替えは、検索UIと個別ページの内容がずれるため更新手順に使いません。

## データ形式

`pokemon.json` のデータ形式：

```json
{
  "managementId": "06005",
  "pokemonName": "ピカチュウ",
  "dexNo": 25,
  "generation": 6,
  "game": "X, Y",
  "region": "日本",
  "eventName": "ポケモンセンター配布",
  "distributionMethod": "ローカル",
  "distributionLocation": "ポケモンセンター",
  "startDate": "2014-07-19",
  "endDate": "2014-09-30",
  "shiny": "",
  "ot": "ポケセン",
  "trainerId": "140Pokemon",
  "ball": "プレシャスボール",
  "level": 10,
  "ability": "せいでんき",
  "nature": "ようき",
  "gigantamax": "",
  "teraType": "",
  "heldItem": "でんきだま",
  "moves": ["ボルテッカー", "でんこうせっか", "なきごえ", "しっぽをふる"],
  "ribbons": ["クラシックリボン"],
  "notes": ""
}
```

### 特殊フィールド

| フィールド | 対象世代 | 説明 |
|-----------|---------|------|
| `region` | 全世代 | 配布地域（日本/北米/欧州/韓国/台湾/全世界） |
| `gigantamax` | 8世代 | キョダイマックス |
| `teraType` | 9世代 | テラスタイプ |
| `alpha` | LA/Z-A | オヤブン |

**regionについて**: 第6-7世代は3DSのリージョンロック、第8世代以降は各国法人ごとのイベント区別に使用。Switchはリージョンフリーだが、海外限定シリアル（例: ロックスターストリンダー）などの区別に必要。

詳細は [`docs/data-design.md`](docs/data-design.md) を参照。

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [`CLAUDE.md`](CLAUDE.md) | 開発ガイド（Claude Code用） |
| [`SECURITY.md`](SECURITY.md) | セキュリティチェック結果 |
| [`docs/data-design.md`](docs/data-design.md) | データ設計書（カラム定義。GAS/スプレッドシートは引退・参考） |
| [`docs/deploy.md`](docs/deploy.md) | デプロイ手順 |
| [`docs/features.md`](docs/features.md) | 機能一覧・実装状況・今後の課題 |

## 参考用：Nuxt版

`nuxt-reference/` フォルダにNuxt.jsで構築したバージョンがあります。
機能拡張の参考用として残しています（修正不要）。

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

このアプリケーションは非公式のファンプロジェクトであり、株式会社ポケモン、任天堂、またはその関連会社とは一切関係ありません。ポケモン関連の商標はそれぞれの所有者に帰属します。
