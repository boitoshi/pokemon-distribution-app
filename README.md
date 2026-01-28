# ポケモン配信情報検索サイト

過去に配信・配布されたポケモンの情報を検索できる非公式サイトです。

## 構成

このリポジトリには2つのバージョンがあります：

```
pokemon-distribution-app/
├── index.html          ← メイン（シンプルHTML版）
├── pokemon.json        ← ポケモンデータ
├── README.md
└── nuxt-reference/     ← Nuxt版（将来の参考用）
```

### シンプルHTML版（メイン）

- **`index.html`** - 単一HTMLファイルで完結
- **`pokemon.json`** - ポケモン配布データ

#### 特徴

- 1ファイルで完結、すぐに動作
- フレームワーク不要、ビルド不要
- GitHub Pages等で簡単にデプロイ可能
- レスポンシブデザイン対応

#### デプロイ方法

1. `index.html` と `pokemon.json` を同じディレクトリに配置
2. GitHub Pages や任意のWebサーバーで公開

### Nuxt版（参考用）

`nuxt-reference/` フォルダにNuxt.jsで構築したバージョンがあります。
将来的に機能を拡張したい場合の参考として残しています。

#### Nuxt版の特徴

- コンポーネント分割による保守性
- TypeScriptによる型安全性
- SSG（静的サイト生成）対応
- 詳細ページあり

## 機能

- 配信ポケモンの一覧表示
- ポケモン名・イベント名で検索
- 世代、ゲーム、配信方法でフィルター
- 色違い、キョダイマックス、テラスタイプでフィルター

## データ形式

`pokemon.json` のデータ形式：

```json
{
  "managementId": "08O01",
  "pokemonName": "ニャース",
  "shiny": "",
  "dexNo": 52,
  "generation": 8,
  "game": "ソード, シールド",
  "eventName": "早期購入特典",
  "distributionMethod": "オンライン",
  "distributionLocation": "オンライン",
  "startDate": "2019-11-14",
  "endDate": "2020-01-14",
  "ot": "(プレイヤーのもの)",
  "trainerId": "(プレイヤーのもの)",
  "ball": "プレシャスボール",
  "level": 5,
  "ability": "ものひろい",
  "nature": "ランダム",
  "gigantamax": "キョダイマックス",
  "teraType": "",
  "heldItem": "",
  "move1": "ねこだまし",
  "move2": "なきごえ",
  "move3": "きりさく",
  "move4": "ネコにこばん",
  "ribbon1": "クラシックリボン",
  "notes": ""
}
```

## データの更新

GoogleスプレッドシートからJSONをエクスポートして `pokemon.json` を置き換えてください。

## ライセンス

このプロジェクトは[MIT License](LICENSE)の下で公開されています。

このアプリケーションは非公式のファンプロジェクトであり、株式会社ポケモン、任天堂、またはその関連会社とは一切関係ありません。ポケモン関連の商標はそれぞれの所有者に帰属します。
