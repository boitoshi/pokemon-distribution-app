---
name: build
description: 本番用ビルドを実行する。「ビルドして」「npm run buildして」「デプロイ前の準備して」「本番用に生成して」と言ったときに使う。
user_invocable: true
---

# 本番ビルド

## 手順
1. `npm run lint` を実行（Lintチェック）
2. `npm run smoke` を実行（データ整合性チェック）
3. `npm run build` を実行
4. ビルドエラーがあれば内容を分析し、修正提案をユーザーに報告
   - TypeScriptエラー → 該当ページ（`src/pages/index.astro` など）のフロントマターの interface を確認
   - パス解決エラー → `astro.config.mjs` の `base` 設定を確認
5. 成功時: `dist/` に生成されたファイルをユーザーに報告（`npm run build` はベータ（GitHub Pages）向けで、base pathは `/pokemon-distribution-app/`。`npm run build:prod` は旧本番向けで、現行配信には使わない）

## 次のステップ
ビルド成功後 → `/preview` でプレビュー確認 → `/deploy` でデプロイ
