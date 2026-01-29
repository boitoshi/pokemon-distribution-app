---
name: customize-display
description: カード・モーダルの表示要素を追加・削除する手順
user_invocable: true
---

<skill>

## 表示要素のカスタマイズ手順

カードやモーダルに表示する要素を追加・削除する際の手順です。

---

## ファイル構成

| ファイル | 役割 |
|----------|------|
| `src/components/PokemonCard.astro` | HTMLテンプレート（カード・モーダル） |
| `src/pages/index.astro` | JavaScript（データ→表示のロジック） |
| `src/layouts/Layout.astro` | CSS（スタイル定義） |

---

## 要素を追加する手順

### 1. テンプレートに要素を追加

`PokemonCard.astro` を編集：

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

### 2. JavaScriptでデータを設定

`index.astro` の該当関数を編集：

**カードの場合（createPokemonCard関数）:**
```javascript
// 新要素の設定
if (pokemon.新フィールド) {
    card.querySelector('.新要素').textContent = pokemon.新フィールド;
    card.querySelector('.新要素-row').style.display = '';
}
```

**モーダルの場合（showDetailModal関数）:**
```javascript
// 新要素の設定
if (pokemon.新フィールド) {
    modal.querySelector('.modal-新要素').textContent = pokemon.新フィールド;
    modal.querySelector('.modal-新要素-row').style.display = '';
}
```

### 3. CSSを追加（必要に応じて）

`Layout.astro` の `<style is:global>` 内に追加：

```css
.新要素 {
    /* スタイル定義 */
}
```

### 4. TypeScript型定義を更新

`PokemonCard.astro` のinterfaceに追加：

```typescript
export interface Pokemon {
    // 既存フィールド...
    新フィールド?: string;  // オプションの場合は ? を付ける
}
```

---

## 要素を削除する手順

### 1. テンプレートから削除

`PokemonCard.astro` から該当のHTML要素を削除

### 2. JavaScriptから削除

`index.astro` の `createPokemonCard` および `showDetailModal` 関数から該当ロジックを削除

### 3. CSSを削除（任意）

`Layout.astro` から不要になったスタイル定義を削除

---

## よくある表示パターン

### バッジ表示
```javascript
// バッジを追加
const badge = document.createElement('span');
badge.className = 'badge badge-タイプ';
badge.textContent = 'テキスト';
container.appendChild(badge);
```

### 条件付き表示（ゲーム別）
```javascript
// ソード・シールドのみ
if (pokemon.game && (pokemon.game.includes('ソード') || pokemon.game.includes('シールド'))) {
    // 表示処理
}

// スカーレット・バイオレットのみ
if (pokemon.game && (pokemon.game.includes('スカーレット') || pokemon.game.includes('バイオレット'))) {
    // 表示処理
}
```

### 配列データの表示
```javascript
// moves配列を表示
const moves = pokemon.moves || [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4].filter(Boolean);
moves.forEach(move => {
    const item = document.createElement('div');
    item.className = 'move-item';
    item.textContent = move;
    container.appendChild(item);
});
```

---

## チェックリスト

- [ ] テンプレート（HTML）を追加/削除
- [ ] JavaScript（ロジック）を追加/削除
- [ ] CSS（スタイル）を追加/削除
- [ ] 型定義（interface）を更新
- [ ] 開発サーバーで動作確認

</skill>
