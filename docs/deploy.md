# ビルド・同期・デプロイ手順

## この文書の担当

検索アプリの実行手順をここで管理する。WP・summary-pagesとの役割分担と検索掲載範囲は
[ADR 0010](../../pokebros-content-hub/docs/adr/0010-distribution-deploy-canonical.md)、
現行本番の配置・検索統合は
[ADR 0017](../../pokebros-content-hub/docs/adr/0017-static-apps-to-cloudflare-pages.md)を参照。
このリポジトリは旧アプリで、現行本番は pokebros-tools の `https://data.pokebros.net/distribution/`。

公開実績・実施待ち・未決方針は
[配信まわりの作業入口](../../pokebros-content-hub/research-notes/20260914-distribution-placement-proposal.md)。
URLの決定と、本番反映の完了は別に確認する。

## ビルド先

| 対象 | コマンド | 公開URL・base | インデックス |
|---|---|---|---|
| ベータ（GitHub Pages） | `npm run build` | `https://boitoshi.github.io/pokemon-distribution-app/`・`/pokemon-distribution-app` | 全ページnoindex |
| 旧本番向けビルド（現行配信には使用しない） | `npm run build:prod` | `/distribution/search` | 個別ページのみnoindex。トップ・タイムラインは対象 |

`astro.config.mjs` が `DEPLOY_TARGET=production` で切り替える。
ビルド結果は `dist/`。旧本番URLは現行データサイトへ301転送する。

## データ更新

JSONだけの差し替えでは個別ページのHTMLが古いままになる。
`src/pages/pokemon/[id].astro` はビルド時にJSONを読み込んで静的HTMLを生成するため、
データ更新時も同期後にビルド・デプロイする。

1. pokemon-dataで正本から生成する。

   ```bash
   # pokemon-data リポジトリで実行
   npm run build
   ```

2. 検索アプリに戻り、生成済みデータを同期して検証する。

   ```bash
   # pokemon-distribution-app リポジトリで実行
   node scripts/sync-from-pokemon-data.mjs
   npm run lint
   npm run check
   npm run smoke
   npm run build
   ```

3. 差分を確認し、対象ファイルをcommit・pushする。mainのpushでベータが更新される。
4. 現行本番の更新は pokebros-tools 側で同期・検証し、下記の Cloudflare Pages 経路で反映する。

検索アプリの同期だけで両方更新したとは扱わない。
summary-pagesと一度に同期・検証するときは、content-hubの実行スクリプトを使う。
pokemon-dataの検証・ビルドから、両アプリの同期・正本との照合・検証・production buildまで順に通す。

```bash
# pokebros-content-hub リポジトリで実行
uv run scripts/sync-distribution-apps.py          # 同期・検証・production build
uv run scripts/sync-distribution-apps.py --check  # コマンドを実行せず、コピーと正本の一致だけ確認
```

片側が失敗しても、もう片側は続けてから非0で終わり、工程ごとの結果と更新されたパスを表示する。
巻き戻しはしないので、原因を直して再実行する。commit・push・公開はしない。

## ベータのデプロイ

GitHub Settings → Pages → SourceをGitHub Actionsに設定する。
`.github/workflows/deploy-pages.yml` がmainのpushまたは手動起動でビルド・配置する。
表示、絞り込み、タイムライン、個別ページへの遷移を確認する。

## 本番のデプロイ

現行本番は pokebros-tools のデータサイトに統合済み。
`tools/summary-pages/` の検証後、main へのマージで Cloudflare Pages が本番へ自動デプロイする。
PR ごとにプレビューが作られる。実行手順は
[pokebros-tools の運用ガイド](../../pokebros-tools/AGENTS.md)を参照。

## まとめページへの導線

`src/data/gen-guides.json` は、検索トップから案内するまとめページ（summary-pages・WP記事）と対応世代の表。
ビルド時に同じ `public/pokemon.json` を数え、対応世代の配信データがあるページだけリンクする。
データが無いページはリンクせず、リンク帯の下に「未収録」と表示する（配信が無かったという意味ではない）。
トップには summary-pages の一覧トップへのリンクも置く。

表に書くURLは公開済みのページに限る。
未収録の世代にデータを足すと、検索側はデータ同期だけでリンクが有効になる。
そのため summary-pages の該当ページを先に本番反映する。
現在の収録状況はデータから数え、この文書に写さない。

## トラブルシューティング

- CSS・画像のパスが違う: 本番用ビルドか、`astro.config.mjs` のbaseと確認する。
- 検索結果と個別ページの内容が違う: JSONだけを差し替えていないか、同じ同期データからHTMLを再ビルドしたか確認する。
- 公開URLが見つからない: 対象runの転送先と成功ログを確認する。dry-runやGitの状態だけでは公開を証明できない。
