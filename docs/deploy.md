# ビルド・同期・デプロイ手順

## この文書の担当

検索アプリの実行手順をここで管理する。WP・summary-pagesとの役割分担と検索掲載範囲は
[ADR 0010](../../pokebros-content-hub/docs/adr/0010-distribution-deploy-canonical.md)、
通常のFTP経路と緊急時の退避経路は
[ADR 0014](../../pokebros-content-hub/docs/adr/0014-environment-capability-and-ftp-single-executor.md)を参照。

公開実績・実施待ち・未決方針は
[配信まわりの作業入口](../../pokebros-content-hub/research-notes/20260914-distribution-placement-proposal.md)。
URLの決定と、本番反映の完了は別に確認する。

## ビルド先

| 対象 | コマンド | 公開URL・base | インデックス |
|---|---|---|---|
| ベータ（GitHub Pages） | `npm run build` | `https://boitoshi.github.io/pokemon-distribution-app/`・`/pokemon-distribution-app` | 全ページnoindex |
| 本番（ConoHa） | `npm run build:prod` | `https://www.pokebros.net/distribution/search/`・`/distribution/search` | 個別ページのみnoindex。トップ・タイムラインは対象 |

`astro.config.mjs` が `DEPLOY_TARGET=production` で切り替える。
ビルド結果は `dist/`。`npm run build` の成果物を本番へ置かない。

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
4. ベータ確認後、本番反映が承認された範囲を下記手順で反映する。

summary-pagesへの同期は別作業。検索アプリの同期だけで両方更新したとは扱わない。
両方の更新をどうまとめるかは作業入口の未決事項を参照。

## ベータのデプロイ

GitHub Settings → Pages → SourceをGitHub Actionsに設定する。
`.github/workflows/deploy-pages.yml` がmainのpushまたは手動起動でビルド・配置する。
表示、絞り込み、タイムライン、個別ページへの遷移を確認する。

## 本番のデプロイ

### 設定

検索アプリのSettings → Secrets and variables → Actionsで管理する。

| 種類 | 名前 | 値・用途 |
|---|---|---|
| Secrets | `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` | 接続情報 |
| Variables | `FTP_PROTOCOL` | 省略時は `ftps` |
| Variables | `FTP_SERVER_DIR` | 必須: `/public_html/pokebros.net/distribution/search/` |

FTPログインルートはホームなので、公開先を絶対パスで指定する。
workflowは最初のステップで、この値と完全一致するかを検査する。
未設定・相対パス・別の配置先・親ディレクトリなら、checkoutや転送の前に失敗する（fallbackは無い）。

### 実行

content-hubから共通の入口を使う。

```bash
# pokebros-content-hub リポジトリで実行
bash scripts/ftp-deploy.sh search-app --dry-run                      # main をその場でSHAに解決
bash scripts/ftp-deploy.sh search-app --dry-run --source-ref <ref>   # 別のブランチ・タグ・SHA
```

スクリプトはビルドするコミットを40桁SHAに確定し、workflowの入力 `source_sha` として渡す。
workflowはそのSHAをcheckoutし、HEADとの一致を検査する。
runは起動ごとのrequest IDをrun-nameに入れて照合するので、同時に起動された別runや過去runは拾わない。
出力のrepo・source SHA・workflow・dry-run・run URL・転送先を確認する。
「全ファイル新規」だけで未公開と断定しない。

本番反映の明示指示がある場合に、dry-runの最後に表示されたコマンドで実行する。

```bash
# pokebros-content-hub リポジトリで実行
bash scripts/ftp-deploy.sh search-app --source-ref <dry-runの40桁SHA> --expect-workflow <dry-runのblob>
```

本番は、dry-runで確認したコミットSHAとworkflow定義の版（blob）の両方を40桁で指定する（mainを解決し直さない）。
どちらかを省略すると起動前に止まる。
定義の版は2回照合する。起動前にスクリプトが、dispatch後にrunの中でcheckout・転送の前に照合する。
どちらかで変わっていれば止まるので、dry-run からやり直す。
ソースSHAが同じでも、workflow定義や依存解決が変われば成果物が同じとは限らない。
Actions UIから直接起動する場合も `source_sha` の入力が必須で、配置先の検査は同じく効く。
UIから本番を起動するときは `workflow_blob` も必須。dry-runなら空でよく、そのときは実際の版をsummaryに残す。

workflowはlint・型チェック・smoke・production buildの後、全成果物を同期する。
転送結果と対象runを確認してから、公開反映済みとして記録する。
Gitのpushやdry-run成功だけで本番反映済みにしない。

## 世代リンク帯

`src/data/gen-guides.json` の `externalUrl` が非空の対象だけ表示する。
`plannedUrl` は候補であり、公開ページの存在を保証しない。
summary-pagesの公開実績、掲載データ、リンク方針を確認した対象から有効化する。
現在の有効対象はJSONを確認し、この文書に日付付きの写しを持たない。

## トラブルシューティング

- CSS・画像のパスが違う: 本番用ビルドか、`astro.config.mjs` のbaseと確認する。
- 検索結果と個別ページの内容が違う: JSONだけを差し替えていないか、同じ同期データからHTMLを再ビルドしたか確認する。
- 公開URLが見つからない: 対象runの転送先と成功ログを確認する。dry-runやGitの状態だけでは公開を証明できない。
