#!/usr/bin/env node
// 配信ポケモンデータの正本は pokemon-data リポジトリ（L2: distributions/*.json）。
// build-distributions.mjs が app-runtime schema へ前方向生成した L3 成果物
// pokemon-data/build/pokemon.json を、このアプリの public/pokemon.json へコピーする。
//
// これにより従来の tools→app→tools 循環（旧 sync-from-tools.mjs / summary-pages の
// sync-dist-data.mjs）が消滅し、両アプリは pokemon-data から pull only になる。
//
// - pokemon-data が手元に無い環境（CI 等）では既存の public/pokemon.json を保持（ENOENT graceful）。
//   ※ CI/本番は「コミット済みの public/pokemon.json」をそのまま使う。本スクリプトはローカル更新用。
// - 件数が減る同期は事故防止のため既定で拒否（意図的削減のみ ALLOW_SHRINK=1）。
//
// 実行: node scripts/sync-from-pokemon-data.mjs [build/pokemon.json のパス]
import fs from "node:fs";

const SOURCE = process.argv[2] ?? "../pokemon-data/build/pokemon.json";
const DEST = "public/pokemon.json";

let sourceRaw;
try {
  sourceRaw = fs.readFileSync(SOURCE, "utf8");
} catch (err) {
  if (err.code === "ENOENT") {
    console.warn(
      `⚠️  ${SOURCE} が見つかりません（pokemon-data 未 checkout）。既存の ${DEST} を保持します。`,
    );
    process.exit(0);
  }
  throw err;
}

const source = JSON.parse(sourceRaw);
if (!Array.isArray(source) || source.length === 0) {
  console.error(`❌ ${SOURCE} が非空配列ではありません。同期を中止します。`);
  process.exit(1);
}

let prevCount = 0;
if (fs.existsSync(DEST)) {
  try {
    prevCount = JSON.parse(fs.readFileSync(DEST, "utf8")).length;
  } catch {
    prevCount = 0;
  }
}

if (source.length < prevCount && process.env.ALLOW_SHRINK !== "1") {
  console.error(
    `❌ 同期を中止: ${SOURCE} ${source.length}件 < 既存 ${DEST} ${prevCount}件（件数が減少）。\n` +
      `   pokemon-data の build が古い/壊れていないか確認してください。\n` +
      `   意図的な削減なら ALLOW_SHRINK=1 を付けて再実行。既存 ${DEST} は保持しました。`,
  );
  process.exit(1);
}

fs.writeFileSync(DEST, JSON.stringify(source, null, 2) + "\n", "utf8");
console.log(`✅ ${DEST} に ${source.length}件を同期しました（source: ${SOURCE} / 前回 ${prevCount}件）。`);

// ---- アイコン対応表（ボール / テラスタイプ / リボン / あかし / 状態）----
// 正本は content-hub の reference-data/distribution-assets.json
// （scripts/fetch_distribution_assets.py が Bulbapedia から集めて生成する）。
// 日本語名 → ファイル名スラッグの対応が入っており、summary-pages も同じものを
// pull-only でコピーしている。ここでべた書きの変換表を持たないこと（二重管理になる）。
const ASSETS_SOURCE = "../pokebros-content-hub/reference-data/distribution-assets.json";
const ASSETS_DEST = "src/data/distribution-assets.json";

try {
  const assets = JSON.parse(fs.readFileSync(ASSETS_SOURCE, "utf8"));
  const kinds = Object.keys(assets.slugs ?? {});
  const total = kinds.reduce((n, k) => n + Object.keys(assets.slugs[k]).length, 0);
  fs.writeFileSync(ASSETS_DEST, JSON.stringify(assets, null, 2) + "\n", "utf8");
  console.log(`✅ ${ASSETS_DEST} に ${total}件を同期しました（${kinds.join(" / ")}）。`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.warn(
      `⚠️  ${ASSETS_SOURCE} が見つかりません（content-hub 未 checkout）。既存の ${ASSETS_DEST} を保持します。`,
    );
  } else {
    console.error(`❌ ${ASSETS_DEST} の同期エラー:`, err.message);
    process.exit(1);
  }
}

// 重複エントリの転送（重複id → 本来のid）。正本は pokemon-data の distributions/*.json の duplicateOf で、
// build/meta.json の redirects に出る。重複は pokemon.json から外れるので、公開URL /pokemon/{重複id}/ を
// 404 にしないよう astro.config.mjs がこの対応から転送ページを作る。
const META_SOURCE = SOURCE.replace(/pokemon\.json$/, "meta.json");
const REDIRECTS_DEST = "src/data/redirects.json";
try {
  const meta = JSON.parse(fs.readFileSync(META_SOURCE, "utf8"));
  const redirects = meta.redirects ?? {};
  fs.writeFileSync(REDIRECTS_DEST, JSON.stringify(redirects, null, 2) + "\n", "utf8");
  console.log(`✅ ${REDIRECTS_DEST} に ${Object.keys(redirects).length}件を同期しました。`);
} catch (err) {
  if (err.code === "ENOENT") {
    console.warn(`⚠️  ${META_SOURCE} が見つかりません。既存の ${REDIRECTS_DEST} を保持します。`);
  } else {
    console.error(`❌ ${REDIRECTS_DEST} の同期エラー:`, err.message);
    process.exit(1);
  }
}
