---
name: deploy
description: 本番サーバーへのデプロイ手順を案内する。「デプロイして」「公開して」「本番反映して」「サーバーにアップして」と言ったときに使う。
user_invocable: true
---

# デプロイ手順

デプロイは二段構え（2026-08-03 決定。詳細は CLAUDE.md「デプロイ・データ更新」節）。`/distribution/` 配下の世代・大会まとめ等の本番デプロイ正本は pokebros-tools の summary-pages 側（2026-07-29 決定）。本アプリは検索・タイムライン・比較・お気に入り・所持チェックリストのツール層。

- **①ベータ**: GitHub Pages `https://boitoshi.github.io/pokemon-distribution-app/`（`base: '/pokemon-distribution-app'`）。main への push で `.github/workflows/deploy-pages.yml` が自動デプロイ。全ページ noindex
- **②本番**（ベータ確認後）: ConoHa FTP `https://www.pokebros.net/distribution/search/`（`base: '/distribution/search'`）。`npm run build:prod`（`DEPLOY_TARGET=production`）でビルドし手動FTPアップロード。`pokemon/[id]` のみ noindex

## ①ベータへのデプロイ

main ブランチへ push すれば `.github/workflows/deploy-pages.yml` が自動デプロイする。手動操作は不要。

1. 変更を main へ push
2. Actions の `deploy-pages.yml` の実行結果を確認
3. `https://boitoshi.github.io/pokemon-distribution-app/` で動作確認

## ②本番へのデプロイ（ベータ確認後・手動FTP）

### 前提条件
`dist/` が `npm run build:prod` の最新ビルド結果を持っていること。

### 手順
1. `npm run build:prod` を実行し `dist/` を生成（未実行なら案内）
2. `dist/` の存在と最終更新日時を確認
3. デプロイ方法をユーザーに確認（FTP/SFTP/rsync 等）
4. 選択されたデプロイ方法で `dist/` の内容を ConoHa の `/distribution/search/` 配下へアップロード
5. デプロイ完了後、`https://www.pokebros.net/distribution/search/` で動作確認をユーザーに促す

## ディレクトリ構成（出力）
```
dist/
├── index.html
├── pokemon.json
└── _astro/
    └── (CSS/JSファイル)
```

## 設定確認
`astro.config.mjs` のベースパスは `DEPLOY_TARGET` 環境変数で切り替わる:
```javascript
const isProd = process.env.DEPLOY_TARGET === 'production';
base: isProd ? '/distribution/search' : '/pokemon-distribution-app',
```

## 次のステップ
デプロイ完了後 → 本番URLで動作確認 → 問題なければ `/data-update` でデータ更新サイクルへ
