---
name: customize-display
description: カード・モーダルの表示要素を追加・削除する。「カードに項目を追加したい」「モーダルの表示を変えたい」「表示要素をカスタマイズしたい」「新しい列を追加して」と言ったときに使う。
user_invocable: true
---

# 表示要素のカスタマイズ

## ファイル構成
| ファイル | 役割 |
|---|---|
| `src/components/PokemonCard.astro` | HTMLテンプレート（カード・モーダル）+ TypeScript型定義 |
| `src/pages/index.astro` | JavaScript（データ→表示のロジック） |
| `src/layouts/Layout.astro` | CSS（スタイル定義） |

## 要素を追加する手順

### 1. テンプレートに要素を追加（PokemonCard.astro）
```html
<!-- カードに追加する場合 -->
<div class="info-row 新要素-row" style="display: none;">
    <div class="info-label">ラベル名:</div>
    <div class="info-value 新要素"></div>
</div>

<!-- モーダルに追加する場合 -->
<div class="info-row modal-新要素-row" style="display: none;">
    <div class="info-label">ラベル名:</div>
    <div class="info-value modal-新要素"></div>
</div>
```

### 2. JavaScriptでデータを設定（index.astro）
**カードの場合（createPokemonCard関数）:**
```javascript
if (pokemon.新フィールド) {
    card.querySelector('.新要素').textContent = pokemon.新フィールド;
    card.querySelector('.新要素-row').style.display = '';
}
```

**モーダルの場合（showDetailModal関数）:**
```javascript
if (pokemon.新フィールド) {
    modal.querySelector('.modal-新要素').textContent = pokemon.新フィールド;
    modal.querySelector('.modal-新要素-row').style.display = '';
}
```

### 3. TypeScript型定義を更新（PokemonCard.astro のinterface）
```typescript
export interface Pokemon {
    // 既存フィールド...
    新フィールド?: string;
}
```

### 4. CSSを追加（必要な場合のみ、Layout.astro）
```css
.新要素 { /* スタイル定義 */ }
```

## 要素を削除する手順
1. `PokemonCard.astro` から対象のHTML要素を削除
2. `index.astro` の `createPokemonCard` と `showDetailModal` から対象ロジックを削除
3. `Layout.astro` から不要なスタイルを削除（任意）

## よくある表示パターン

### 配列データ（技・リボン等）
```javascript
const moves = pokemon.moves || [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4].filter(Boolean);
moves.forEach(move => {
    const item = document.createElement('div');
    item.className = 'move-item';
    item.textContent = move;
    container.appendChild(item);
});
```

### ゲーム別条件表示
```javascript
if (pokemon.game && pokemon.game.includes('スカーレット')) {
    // スカーレット限定の表示
}
```

## チェックリスト
- [ ] PokemonCard.astro: HTMLテンプレートを追加/削除
- [ ] index.astro: データ設定ロジックを追加/削除
- [ ] Layout.astro: CSSを追加/削除（必要な場合のみ）
- [ ] PokemonCard.astro: interface型定義を更新
- [ ] `/dev` で動作確認

## 次のステップ
カスタマイズ後 → `/build` でビルド確認
