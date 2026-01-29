# ポケモン配信情報検索サイト

過去に配信・配布されたポケモンの情報を検索できる非公式サイトです。Astroで構築されています。

**公開URL**: https://www.pokebros.net/distribution/

## プロジェクト構成

```
pokemon-distribution-app/
├── src/
│   ├── pages/
│   │   └── index.astro         # メインページ（検索ロジック含む）
│   ├── components/
│   │   ├── SearchBox.astro     # 検索UI（フィルター機能）
│   │   └── PokemonCard.astro   # カード表示・モーダル
│   └── layouts/
│       └── Layout.astro        # 共通レイアウト・グローバルCSS
├── public/
│   └── pokemon.json            # 配信ポケモンデータ
├── docs/
│   ├── data-design.md          # データ設計書（カラム定義）
│   └── deploy.md               # デプロイ手順
├── scripts/
│   └── export-to-json.gs       # GASエクスポートスクリプト
├── astro.config.mjs
├── package.json
└── nuxt-reference/             # Nuxt版（参考用、修正不要）
```

## クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（http://localhost:4321）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

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

### 元データ

Googleスプレッドシートで管理。世代別シートで構成。

| シート | 内容 |
|--------|------|
| 第1-2世代 | GB/GBC（カントー・ジョウト） |
| 第3世代 | GBA（ホウエン） |
| 第4-5世代 | DS（シンオウ・イッシュ） |
| 第6-7世代 | 3DS（カロス・アローラ）※リージョン対応 |
| 第8世代 | Switch（ガラル） |
| 第9世代 | Switch（パルデア） |

### データ更新手順

1. Googleスプレッドシートを開く
2. メニュー「Pokemon Export」→「JSONエクスポート」を実行
3. 出力された `pokemon.json` をダウンロード
4. サーバーの `pokemon.json` を差し替え（FTP/SFTP）

**ビルド不要**：JSONはクライアントサイドでfetchするため、ファイル差し替えのみでOK。

詳細は [`docs/data-design.md`](docs/data-design.md) を参照。

### GASスクリプトの設定

1. Googleスプレッドシートで「拡張機能」→「Apps Script」
2. [`scripts/export-to-json.gs`](scripts/export-to-json.gs) の内容を貼り付け
3. 保存してスプレッドシートを再読み込み
4. メニューに「Pokemon Export」が追加される

## デプロイ

### 本番環境

| 項目 | 値 |
|------|-----|
| サーバー | ConoHa |
| URL | https://www.pokebros.net/distribution/ |
| 配置先 | `public_html/distribution/` |

### デプロイ手順

**初回・UI変更時**:
```bash
npm run build
# dist/ の中身を public_html/distribution/ にFTPアップロード
```

**データ更新のみ**:
```
pokemon.json をFTPで上書き（ビルド不要）
```

詳細は [`docs/deploy.md`](docs/deploy.md) を参照。

## データ形式

`pokemon.json` のデータ形式：

```json
{
  "managementId": "06JP01",
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

### 世代別フィールド

| フィールド | 対象世代 | 説明 |
|-----------|---------|------|
| `region` | 1-7世代 | 配信地域（日本/北米/欧州/韓国/台湾/全世界） |
| `gigantamax` | 8世代 | キョダイマックス |
| `teraType` | 9世代 | テラスタイプ |
| `isAlpha` | LA/Z-A | オヤブン |

詳細は [`docs/data-design.md`](docs/data-design.md) を参照。

## ドキュメント

| ファイル | 内容 |
|---------|------|
| [`CLAUDE.md`](CLAUDE.md) | 開発ガイド（Claude Code用） |
| [`docs/data-design.md`](docs/data-design.md) | データ設計書 |
| [`docs/deploy.md`](docs/deploy.md) | デプロイ手順 |

## 参考用：Nuxt版

`nuxt-reference/` フォルダにNuxt.jsで構築したバージョンがあります。
機能拡張の参考用として残しています（修正不要）。

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

このアプリケーションは非公式のファンプロジェクトであり、株式会社ポケモン、任天堂、またはその関連会社とは一切関係ありません。ポケモン関連の商標はそれぞれの所有者に帰属します。
