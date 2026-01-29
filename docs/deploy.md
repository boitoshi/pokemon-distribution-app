# デプロイ手順

## 概要

配信ポケモン検索サイトをConoHaサーバーにデプロイする手順。

## サイト情報

| 項目 | 値 |
|------|-----|
| 本番URL | https://www.pokebros.net/distribution/ |
| サーバー | ConoHa |
| 配置先 | `public_html/distribution/` |

## ディレクトリ構成

```
ConoHaサーバー
└── public_html/
    ├── (WordPressブログ: pokebros.net)
    │   ├── wp-content/
    │   ├── wp-admin/
    │   └── ...
    │
    └── distribution/        ← ここにdist/の中身を配置
        ├── index.html
        ├── pokemon.json
        └── _astro/
```

---

## 初回デプロイ

### 1. ビルド

```bash
npm run build
```

`dist/` フォルダが生成される。

### 2. アップロード

FTP/SFTP で `dist/` の **中身** を `public_html/distribution/` にアップロード。

```
dist/
├── index.html       → public_html/distribution/index.html
├── pokemon.json     → public_html/distribution/pokemon.json
└── _astro/          → public_html/distribution/_astro/
```

### 3. 動作確認

https://www.pokebros.net/distribution/ にアクセスして確認。

---

## データ更新（JSONのみ）

ビルド不要。JSONファイルのみ差し替え。

### 1. JSONエクスポート

1. Googleスプレッドシートを開く
2. メニュー「Pokemon Export」→「JSONエクスポート」
3. `pokemon.json` をダウンロード

### 2. アップロード

FTP/SFTP で `pokemon.json` を `public_html/distribution/` にアップロード（上書き）。

### 3. キャッシュクリア

ブラウザのキャッシュをクリアして確認（Ctrl+Shift+R）。

---

## UI・コード変更時

再ビルドが必要。

### 1. ローカルで確認

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run preview  # ビルド結果確認
```

### 2. アップロード

`dist/` の中身を `public_html/distribution/` にアップロード（上書き）。

---

## FTP設定例

| 項目 | 値 |
|------|-----|
| ホスト | （ConoHaコントロールパネルで確認） |
| ユーザー名 | （ConoHaコントロールパネルで確認） |
| ポート | 21（FTP）または 22（SFTP） |
| ディレクトリ | `/public_html/distribution/` |

### おすすめFTPクライアント

- FileZilla（無料）
- Cyberduck（無料）
- WinSCP（Windows、無料）

---

## トラブルシューティング

### 画像やCSSが読み込まれない

`astro.config.mjs` の `base` 設定を確認:

```js
export default defineConfig({
  site: 'https://www.pokebros.net',
  base: '/distribution',
});
```

### JSONが更新されない

1. ブラウザキャッシュをクリア
2. JSONファイルのアップロード先が正しいか確認
3. ファイル名が `pokemon.json` か確認（大文字小文字注意）

### 404エラーが出る

- `distribution` フォルダが `public_html` 直下にあるか確認
- `index.html` が `distribution` フォルダ内にあるか確認
