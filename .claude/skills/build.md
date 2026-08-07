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
   - TypeScriptエラー → `src/components/PokemonCard.astro` のinterfaceを確認
   - パス解決エラー → `astro.config.mjs` の `base` 設定を確認
5. 成功時: `dist/` に生成されたファイルをユーザーに報告（`npm run build` はベータ（GitHub Pages）向けで、base pathは `/pokemon-distribution-app/`。本番（ConoHa `/distribution/search/`）向けは `npm run build:prod` を使う）

## 次のステップ
ビルド成功後 → `/preview` でプレビュー確認 → `/deploy` でデプロイ
