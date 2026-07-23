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
