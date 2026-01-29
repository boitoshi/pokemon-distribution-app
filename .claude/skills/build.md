---
name: build
description: 本番用ビルドを実行します
user_invocable: true
---

<skill>

## 本番ビルド

Astroで静的サイトをビルドします。

### 実行コマンド

```bash
npm run build
```

### 出力

- `dist/` ディレクトリにビルド結果が生成
- GitHub Pages用にbase pathが適用済み

### ビルド後の確認

```bash
npm run preview
```

でローカルプレビューを確認してください。

### よくあるエラー

1. **TypeScriptエラー**: `src/components/PokemonCard.astro` のinterfaceを確認
2. **パス解決エラー**: `@/*` エイリアスが正しく設定されているか確認

</skill>
