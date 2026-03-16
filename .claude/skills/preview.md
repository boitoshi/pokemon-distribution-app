---
name: preview
description: ビルド結果をプレビューする。「プレビューして」「ビルド結果を確認したい」「本番と同じ環境で見たい」と言ったときに使う。
user_invocable: true
---

# ビルドプレビュー

## 前提条件
事前に `/build` を実行し、`dist/` が存在すること。

## 手順
1. `dist/` ディレクトリの存在を確認
2. `dist/` がない場合は `/build` を先に実行するよう案内して停止
3. `npm run preview` を実行
4. プレビューURLをユーザーに報告（`http://localhost:4321`）

## 次のステップ
プレビュー確認後 → 問題なければ `/deploy` でデプロイ
