#!/usr/bin/env node
// pokebros-tools の正本データ (tools/summary-pages/src/data/pokemon-all.json) を
// public/pokemon.json へ同期する。
//
// - 配信ポケモンデータの正本は pokebros-tools 側。managementId が一致するエントリは
//   正本の内容で上書きする（配列順は維持）
// - 正本に無いエントリ（スプレッドシート管理の第8・9世代/チャンピオンズ、未整備の
//   第7世代分）はそのまま残す
// - 変換ロジックは scripts/export-to-json.gs (GASエクスポート) と同一:
//   game配列→カンマ区切り文字列 / ot_XXX→多言語オブジェクト / ivs_*→オブジェクト /
//   空フィールド除去
//
// 実行: node scripts/sync-from-tools.mjs [toolsのpokemon-all.jsonパス]
import fs from 'node:fs';

const APP_PATH = 'public/pokemon.json';
const TOOLS_PATH =
  process.argv[2] ?? '../pokebros-tools/tools/summary-pages/src/data/pokemon-all.json';

const OT_LANGS = ['JPN', 'ENG', 'SPA', 'FRE', 'GER', 'ITA', 'KOR', 'CHS', 'CHT', 'SPA_EU', 'SPA_LA'];
const IVS_STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

function transformToolsEntry(entry) {
  const obj = { ...entry };

  // game: 配列 → カンマ区切り文字列
  if (Array.isArray(obj.game)) {
    obj.game = obj.game.join(', ');
  }

  // ot: ot_XXX カラムがあれば多言語オブジェクトに変換
  const otObj = {};
  for (const lang of OT_LANGS) {
    if (obj[`ot_${lang}`]) otObj[lang] = obj[`ot_${lang}`];
    delete obj[`ot_${lang}`];
  }
  if (Object.keys(otObj).length > 0) {
    obj.ot = otObj;
  }

  // ivs: ivs_hp〜ivs_spe があればオブジェクトに変換
  const ivsObj = {};
  for (const stat of IVS_STATS) {
    const v = obj[`ivs_${stat}`];
    if (v !== undefined && v !== null && v !== '') ivsObj[stat] = Number(v);
    delete obj[`ivs_${stat}`];
  }
  if (Object.keys(ivsObj).length > 0) {
    obj.ivs = ivsObj;
  }

  // 空フィールド除去
  for (const [k, v] of Object.entries(obj)) {
    if (v === '' || v === null || (Array.isArray(v) && v.length === 0)) {
      delete obj[k];
    }
  }

  return obj;
}

const app = JSON.parse(fs.readFileSync(APP_PATH, 'utf8'));
const tools = JSON.parse(fs.readFileSync(TOOLS_PATH, 'utf8'));

const toolsById = new Map(tools.map((e) => [e.managementId, transformToolsEntry(e)]));

let updated = 0;
let unchanged = 0;
let appOnly = 0;
const out = app.map((p) => {
  const t = toolsById.get(p.managementId);
  if (!t) {
    appOnly++;
    return p;
  }
  toolsById.delete(p.managementId);
  if (JSON.stringify(t) !== JSON.stringify(p)) {
    updated++;
    return t;
  }
  unchanged++;
  return p;
});

// 正本にあってアプリに無いエントリは末尾に追加
const added = [...toolsById.values()];
out.push(...added);

fs.writeFileSync(APP_PATH, JSON.stringify(out, null, 2) + '\n');

console.log(`同期完了: 上書き ${updated}件 / 一致 ${unchanged}件 / 追加 ${added.length}件 / アプリ専用 ${appOnly}件 / 合計 ${out.length}件`);
