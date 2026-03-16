---
name: dev
description: 開発サーバーを起動する。「開発サーバー起動して」「dev起動」「ローカルで確認したい」「npm run devして」と言ったときに使う。
user_invocable: true
---

# 開発サーバー起動

## 手順
1. `npm run dev` を実行
2. サーバー起動後、URLをユーザーに報告
   - `http://localhost:4321/pokemon-distribution-app/`
3. ポートが使用中の場合は `npx astro dev --port 4322` で起動

## 確認事項
- ホットリロード有効（ファイル変更が即座に反映される）
- ベースパス付き: `/pokemon-distribution-app/`

## 次のステップ
確認完了後 → `/build` で本番ビルド
