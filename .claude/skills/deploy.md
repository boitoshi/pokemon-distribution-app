---
name: deploy
description: GitHub Pagesへのデプロイ手順を案内します
user_invocable: true
---

<skill>

## GitHub Pagesデプロイ

### 手順

1. **ビルド実行**
   ```bash
   npm run build
   ```

2. **変更をコミット**
   ```bash
   git add .
   git commit -m "Build for deployment"
   ```

3. **mainブランチにプッシュ**
   ```bash
   git push origin main
   ```

### 設定確認

`astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://boitoshi.github.io',
  base: '/pokemon-distribution-app',
});
```

### デプロイ先URL

https://boitoshi.github.io/pokemon-distribution-app

### 注意

現在のGitHub Actions（`.github/workflows/nuxthub.yml`）はNuxtHub用です。
Astro用のGitHub Actions設定が必要な場合は別途追加してください。

</skill>
