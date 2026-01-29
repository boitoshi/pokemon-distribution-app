---
name: deploy
description: 本番サーバーへのデプロイ手順を案内します
user_invocable: true
---

<skill>

## デプロイ手順

### 1. ビルド実行

```bash
npm run build
```

### 2. 出力確認

`dist/` ディレクトリに静的ファイルが生成されます：

```
dist/
├── pokemon-distribution-app/
│   ├── index.html
│   ├── pokemon.json
│   └── _astro/
│       └── (CSS/JSファイル)
```

### 3. サーバーにアップロード

`dist/` ディレクトリの内容を本番サーバーにアップロードしてください。

- FTP/SFTP
- rsync
- その他お使いのデプロイ方法

### 設定確認

`astro.config.mjs` でベースパスを確認：

```javascript
export default defineConfig({
  site: 'https://boitoshi.github.io',
  base: '/pokemon-distribution-app',
});
```

サーバーのルートにデプロイする場合は `base` を `'/'` に変更してください。

</skill>
