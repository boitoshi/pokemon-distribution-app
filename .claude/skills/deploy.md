---
name: deploy
description: 本番サーバーへのデプロイ手順を案内する。「デプロイして」「公開して」「本番反映して」「サーバーにアップして」と言ったときに使う。
user_invocable: true
---

# デプロイ手順

⚠ **このリポジトリは旧検索アプリ（アーカイブ待ち）。ここから本番へは出さない。**
現行の本番検索は pokebros-tools のデータサイト `https://data.pokebros.net/distribution/` で、
pokebros-tools の main へのマージで Cloudflare Pages が反映する（正本: content-hub の ADR 0017）。
「本番反映して」と言われたら、作業先が `../pokebros-tools` であることを伝える。

⚠ **FTP は使わない。** 旧本番 `www.pokebros.net/distribution/search/` は data へ 301 転送済みで、
このリポジトリの `deploy-ftp.yml` は GitHub 側で無効化、FTP の Secrets も削除済み（2026-10-12）。

## ベータ（GitHub Pages）

main へ push すれば `.github/workflows/deploy-pages.yml` が
`https://boitoshi.github.io/pokemon-distribution-app/` へ自動デプロイする（全ページ noindex）。

1. 変更を main へ push
2. Actions の `deploy-pages.yml` の実行結果を確認
3. ベータの URL で動作確認

手順の詳細は `docs/deploy.md`。
