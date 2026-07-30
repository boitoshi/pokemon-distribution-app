---
name: deploy
description: 本番サーバーへのデプロイ手順を案内する。「デプロイして」「公開して」「本番反映して」「サーバーにアップして」と言ったときに使う。
user_invocable: true
---

# デプロイ手順

**注**: `/distribution/` の本番デプロイ正本は現在 pokebros-tools の summary-pages 側（2026-07-29 決定）。本アプリは summary-pages とは別の流入導線を想定した UI/UX 改善中で、以下は参考手順（デプロイ先URLは未確定）。

## 前提条件
`dist/` が最新のビルド結果を持っていること（`/build` 実行済み）。

## 手順
1. `dist/` の存在と最終更新日時を確認
2. 古いビルドの場合は `/build` を先に実行するよう案内
3. デプロイ方法をユーザーに確認（FTP/SFTP/rsync 等）
4. 選択されたデプロイ方法で `dist/` の内容を本番サーバーにアップロード
5. デプロイ完了後、URLで動作確認をユーザーに促す

## ディレクトリ構成（出力）
```
dist/
├── index.html
├── pokemon.json
└── _astro/
    └── (CSS/JSファイル)
```

## 設定確認
`astro.config.mjs` のベースパス（サブディレクトリ `/distribution/` 配置用）:
```javascript
base: '/distribution',
```

## 次のステップ
デプロイ完了後 → 本番URLで動作確認 → 問題なければ `/data-update` でデータ更新サイクルへ
