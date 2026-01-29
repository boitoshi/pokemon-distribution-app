---
name: dev
description: 開発サーバーを起動します
user_invocable: true
---

<skill>

## 開発サーバー起動

Astro開発サーバーを起動します。

### 実行コマンド

```bash
npm run dev
```

### 確認事項

- サーバーは http://localhost:4321 で起動
- ベースパス付き: http://localhost:4321/pokemon-distribution-app/
- ホットリロード有効

### トラブルシューティング

ポートが使用中の場合:
```bash
npx astro dev --port 4322
```

</skill>
