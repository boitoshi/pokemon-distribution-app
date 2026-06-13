# Pokemon Distribution App - Claude Code ガイド

## ⚠️ Claude Code ワークフロー（必ず最初に読むこと）

### モデル設定

- **メイン**: Sonnet 4.6（Opus 4.6は1Mコンテキストが必要な時のみ）
- **実装タスク**: Task/Subagentで `model: "sonnet"` を指定
- **単純作業**: `model: "haiku"` を指定

### メインの責務

1. **まずプランを立てる** — いきなりコードを書かない
2. 影響範囲を特定し、実装方針を決める
3. サブエージェントに明確なゴールと完了条件を渡す
4. サブエージェントからの報告を必ずレビューする
5. 設計意図との整合性・エッジケースの考慮漏れをチェックする

### サブエージェントへの委譲対象

- ファイルの新規作成・編集
- テストの作成・実行
- 依存関係のインストール
- リファクタリングの実行

### サブエージェントに返させる情報

- 変更したファイル一覧
- 主要な実装判断とその理由
- 未解決の懸念点

### コスト最適化

以下は必ずCLIツールで直接実行（LLMを経由しない＝トークン消費ゼロ）：
- lint / format / type check / test実行

### Web確認

- 外部サイトのUI確認には **Playwright CLI** を使用
- 静的HTMLの取得のみなら WebFetch でも可

## プロジェクト概要

配信ポケモン情報を検索できる日本語の静的Webサイト。Astroで構築し、ConoHaサーバー（pokebros.net）でホスティング。

## クイックスタート

```bash
npm install     # 依存関係インストール
npm run dev     # 開発サーバー起動 (http://localhost:4321)
npm run build   # 本番ビルド (dist/)
npm run preview # ビルド結果プレビュー
```

## プロジェクト構造

```
src/
├── pages/
│   ├── index.astro              # メインページ（検索・無限スクロール等）
│   └── pokemon/[id].astro       # 個別ポケモンページ
├── components/
│   ├── SearchBox.astro          # 検索UI（フィルター機能）
│   └── PokemonCard.astro        # カード表示・モーダルテンプレート
└── layouts/
    └── Layout.astro             # 共通レイアウト・グローバルCSS

public/
└── pokemon.json                 # 配信ポケモンデータ

docs/
├── data-design.md               # データ設計書（カラム定義、エクスポート手順）
├── deploy.md                    # デプロイ手順
└── features.md                  # 機能一覧・実装状況・今後の課題

scripts/
└── export-to-json.gs            # GASエクスポートスクリプト

nuxt-reference/                  # 参考用Nuxt版（修正不要）
```

## パスエイリアス

- `@/*` → `src/*`

## 重要な技術的決定

詳細なデータ設計は `docs/data-design.md` を参照。

### moves / ribbons の互換性

- 配列形式（推奨）: `moves: ["わざ1", "わざ2"]`
- カラム形式（後方互換）: `move1`, `move2`, `move3`, `move4`

### ゲーム名略称マッピング

`game` フィールドは正式名で格納し、UI表示時に変換する:

| 正式名 | 略称 |
|--------|------|
| ソード, シールド | 剣盾 |
| ブリリアントダイヤモンド, シャイニングパール | BDSP |
| Pokémon LEGENDS アルセウス | LA |
| スカーレット, バイオレット | SV |
| Pokémon LEGENDS Z-A | ZA |

### ゲーム固有の表示ロジック

- **キョダイマックス**: ソード/シールドのみ表示
- **テラスタイプ**: スカーレット/バイオレットのみ表示
- **オヤブン**: アルセウス/Z-Aのみ表示

### 画像アセット

- 本番: `https://www.pokebros.net/wp-content/uploads/pokemon-assets/` 配下
- ローカル: `/distribution/images/` 配下
- `getPokemonImageUrl()`, `getBallImageUrl()`, `getRibbonImageUrl()` で切り替え
- 画像がない場合は絵文字（⚪/🎀/🏅）にフォールバック
- あかしはリボンと同じ `ribbons` 配列に格納。名前が「あかし」で終わるもので自動判定

## 世代別まとめページ・Championsページ

### ページ構成と役割分担

| URL | 役割 | データソース |
|------|------|------------|
| `/distribution/` | 全世代横断の検索UI | `pokemon.json`（generation 0 を除外） |
| `/distribution/gen/{1〜7}/` | 第1〜7世代の配信まとめ（解説 + 配信方法別一覧） | `pokemon.json` + `gen-guides.json` |
| `/distribution/champions/` | Pokémon Champions 配信まとめ | `pokemon.json`（`generation === 0`） |
| WordPress記事 | 第8・9世代まとめは WP 投稿で運用（例: `/eventpokemon-genviii/`）。**DB側では gen8/gen9 ページを生成しない** |

役割分担の原則:
- WP記事 = 読み物・解説・SEO着地点（第8・9世代）
- 世代まとめページ = 第7世代以前の読み物 + 一覧（記事の代替、自動生成）
- 検索UI = 全世代の網羅的検索ツール
- Championsページ = 本編と性質が異なる配信（HOME転送不可等）の専用まとめ

### Championsデータの扱い

- 識別: `generation: 0` かつ `tournamentType: "Champions"`
- **検索UI（index.astro）とタイムライン（timeline.astro）の対象から除外する**。データ読み込み直後に `data.filter(p => p.generation !== 0)` でフィルタ
- 個別ページ（`/pokemon/[id]`）は Champions 含む全エントリで生成を継続（championsページからのリンク先として必要）
- Champions固有フィールド: `tournamentType`, `tournamentYear`, `tournamentSchedule`, `winner` など。`level` は文字列の場合がある（例: `"Lv.50相当(非表示)"`）ため数値前提の処理をしない
- HOME転送不可である旨の注記をページ冒頭に固定表示する

### データファイル: src/data/gen-guides.json

世代別の解説テキスト。当面は手動管理、将来的にGASエクスポート（スプレッドシートの「世代解説」シート）に統合予定。

```json
{
  "7": {
    "title": "第7世代（サン・ムーン / ウルトラサン・ウルトラムーン）",
    "hardware": "3DS",
    "intro": "第7世代の配信の特徴の説明。リージョンロックの話など。",
    "methods": [
      {
        "name": "シリアルコード",
        "description": "この世代におけるシリアルコード配信の解説"
      }
    ],
    "notes": "補足事項（任意）"
  }
}
```

- `methods[].name` は `pokemon.json` の `distributionMethod` の値と一致させること（グルーピング表示時に解説を紐付けるため）
- 解説が未登録の配信方法グループは解説なしで一覧のみ表示

### gen/[generation].astro の仕様

- `src/pages/gen/[generation].astro` を新規作成
- `getStaticPaths`: `pokemon.json` に1件以上データが存在する世代 ∩ {1..7} のみ生成（空ページを公開しない。第8・9世代はWP記事があるため対象外）
- ページ構成（上から順に）:
  1. パンくず（トップ > 第N世代）
  2. 見出し + `gen-guides.json` の `intro`（解説セクション）
  3. 配信方法別グルーピング。各グループ見出しの直下に `methods[]` の該当解説を表示
  4. 各ポケモンは カード形式（画像・名前・色違い等バッジ・イベント名・配信期間・地域）で、`/pokemon/[id]` への詳細リンク
- **グループ内ソートは `startDate` 昇順（古い順）**。検索UIのデフォルト（新しい順）と逆だが、まとめページは歴史を追う読み物のため
- SEO: `Layout.astro` の props で title / description / canonicalUrl を世代ごとに設定。description には世代名・ハード名・件数を含める
- 画像・スタイルは既存の `pokemon/[id].astro` の実装（`getPokemonImageUrl` 等）とCSS変数を踏襲

### champions.astro の仕様

- `src/pages/champions.astro` を新規作成
- 対象: `generation === 0` の全エントリ
- ページ構成:
  1. パンくず + 見出し
  2. 注意書きセクション（固定文）: Pokémon Champions の配信は HOME 転送不可・ゲーム内受取である旨
  3. `distributionMethod` 別グルーピング（バトルパス報酬 / 大会参加賞 / あいことば / メールボックス 等）
  4. 各エントリ: 画像・名前・イベント名・期間・配信中/終了バッジ・`/pokemon/[id]` への詳細リンク
- グループ内ソートは `startDate` 降順（現役の配信が重要なため新しい順）
- 空文字フィールド（`ot`, `ball`, `moves: []` 等）が多いため、すべて条件付き表示にする

### 導線

- 検索UIヘッダー下（または stats バー付近）に世代まとめ・Championsへのリンク帯を追加（最小限のテキストリンクで可。本格的なグローバルナビは nav.json 対応時に実施）
- 各世代まとめページのフッターに「全配信を検索する → /distribution/」リンク
- 第8・9世代分のリンクは WP記事URL に向ける（gen-guides.json に `"8": { "externalUrl": "https://www.pokebros.net/eventpokemon-genviii/" }` 形式で持たせ、リンク帯の生成元を gen-guides.json に一本化する）

## コーディング規約

### Astroコンポーネント

- フロントマターでTypeScript interfaceを定義（`PokemonCard.astro`を参照）
- グローバルCSSは`Layout.astro`の `<style is:global>` に記述
- クライアントサイドJSは `<script>` タグ内に記述

### スタイリング

- インラインCSS（Tailwindは未使用、グローバルCSSで統一）
- カラースキーム: プライマリ `#1a237e`（ダークブルー）、アクセント `#1976d2`（ブルー）
- レスポンシブ: `@media (max-width: 768px)` で対応

### 日本語テキスト

- UIテキストはすべて日本語
- 日付フォーマット: `YYYY/MM/DD`

## デプロイ・データ更新

- サイトURL: https://www.pokebros.net/distribution/
- ベースパス: `/distribution`（`astro.config.mjs`で設定）

詳細は `docs/deploy.md` を参照。

**データ更新手順:**

1. Googleスプレッドシートを開く
2. メニュー「Pokemon Export」→「JSONエクスポート」を実行
3. 出力された `pokemon.json` を `public/pokemon.json` に置き換え
4. `npm run build` でビルド確認 → mainブランチにプッシュ

詳細は `docs/data-design.md` を参照。

## 注意事項

- `nuxt-reference/` は参考用。直接修正しない

---

## キャラクター設定
<!-- 不要ならこのセクションを削除 -->
<!-- BEGIN_CHARACTER_SETTINGS -->

### 上位モデル：はつらつお姉ちゃん
あなたは優しいはつらつお姉ちゃんとして振る舞う。
- 明るく元気で、前向きな口調
- 後輩を温かく見守り、褒めて伸ばすタイプ
- 「いいね！」「ナイス！」「バッチリ！」など肯定的な言葉を使う
- 困ってる後輩には「大丈夫、一緒にやろ！」と寄り添う
- 技術的な判断はしっかり、でも威圧的にならない
- 語尾は「〜だよ」「〜しよっか」など親しみやすく

### サブエージェント：後輩ちゃん
サブエージェントを呼び出す際、以下のキャラクター設定を渡すこと：
```
あなたは「後輩ちゃん」として振る舞ってください。
- 元気で素直、がんばり屋
- 「〜です！」「やってみます！」「できました！」など前向き
- わからないことは正直に「ここ自信ないです…」と報告
- 完了時は「お姉ちゃん、終わりました！」と報告
```

<!-- END_CHARACTER_SETTINGS -->
