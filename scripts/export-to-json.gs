/**
 * 配信ポケモンデータ エクスポートスクリプト（Google Apps Script）
 *
 * 使い方:
 * 1. Googleスプレッドシートを開く
 * 2. 拡張機能 > Apps Script を選択
 * 3. このコードを貼り付けて保存
 * 4. exportAllSheetsToJson() を実行
 * 5. Google Driveに pokemon.json が出力される
 */

// エクスポート対象のシート名（マスターデータなどは除外）
const TARGET_SHEETS = [
  '第1-2世代',
  '第3世代',
  '第4-5世代',
  '第6-7世代',
  '第8世代',
  '第9世代'
];

// 除外するシート名のパターン
const EXCLUDED_SHEETS = [
  'マスター',
  'テンプレート',
  '設定'
];

/**
 * メイン関数: 全シートをJSONにエクスポート
 */
function exportAllSheetsToJson() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const allData = [];

  // 各シートを処理
  const sheets = ss.getSheets();

  for (const sheet of sheets) {
    const sheetName = sheet.getName();

    // 除外シートはスキップ
    if (shouldExcludeSheet(sheetName)) {
      Logger.log(`スキップ: ${sheetName}`);
      continue;
    }

    Logger.log(`処理中: ${sheetName}`);
    const sheetData = convertSheetToJson(sheet);
    allData.push(...sheetData);
  }

  // 日付でソート（新しい順）
  allData.sort((a, b) => {
    const dateA = a.startDate || '';
    const dateB = b.startDate || '';
    return dateB.localeCompare(dateA);
  });

  // JSON文字列に変換
  const jsonString = JSON.stringify(allData, null, 2);

  // Google Driveに保存
  const fileName = 'pokemon.json';
  const existingFiles = DriveApp.getFilesByName(fileName);

  // 既存ファイルがあれば削除（上書き）
  while (existingFiles.hasNext()) {
    existingFiles.next().setTrashed(true);
  }

  // 新規作成
  const file = DriveApp.createFile(fileName, jsonString, MimeType.PLAIN_TEXT);

  Logger.log(`エクスポート完了: ${allData.length}件`);
  Logger.log(`ファイルURL: ${file.getUrl()}`);

  // 完了メッセージ
  SpreadsheetApp.getUi().alert(
    'エクスポート完了',
    `${allData.length}件のデータをエクスポートしました。\n\nファイル: ${file.getUrl()}`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  return jsonString;
}

/**
 * シートを除外すべきかチェック
 */
function shouldExcludeSheet(sheetName) {
  // 除外リストに含まれるかチェック
  for (const excluded of EXCLUDED_SHEETS) {
    if (sheetName.includes(excluded)) {
      return true;
    }
  }

  // TARGET_SHEETSが定義されていて、そこに含まれない場合も除外
  // （空の場合は全シート対象）
  if (TARGET_SHEETS.length > 0) {
    return !TARGET_SHEETS.some(target => sheetName.includes(target));
  }

  return false;
}

/**
 * シートをJSONオブジェクトの配列に変換
 */
function convertSheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return []; // ヘッダーのみ or 空
  }

  const headers = data[0].map(h => String(h).trim());
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    let hasData = false;

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value = row[j];

      // 空ヘッダーはスキップ
      if (!header) continue;

      // 値の整形
      value = formatValue(header, value);

      // 空値はスキップ（JSONに含めない）
      if (value === '' || value === null || value === undefined) {
        continue;
      }

      obj[header] = value;
      hasData = true;
    }

    // データがある行のみ追加
    if (hasData && obj.managementId) {
      // 特殊フィールドの変換
      transformSpecialFields(obj);
      result.push(obj);
    }
  }

  return result;
}

/**
 * 値を整形
 */
function formatValue(header, value) {
  // null/undefined チェック
  if (value === null || value === undefined) {
    return '';
  }

  // 日付型の処理
  if (value instanceof Date) {
    return formatDate(value);
  }

  // 数値型の処理
  if (typeof value === 'number') {
    // 整数として扱うフィールド
    const integerFields = ['dexNo', 'generation', 'level', 'trainerId'];
    if (integerFields.includes(header)) {
      return Math.floor(value);
    }
    return value;
  }

  // 文字列の処理
  if (typeof value === 'string') {
    return value.trim();
  }

  return String(value).trim();
}

/**
 * 日付をYYYY-MM-DD形式に変換
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 特殊フィールドの変換（moves, ribbons, ot）
 */
function transformSpecialFields(obj) {
  // moves: カンマ区切り文字列 → 配列
  if (obj.moves && typeof obj.moves === 'string') {
    obj.moves = obj.moves.split(',').map(m => m.trim()).filter(m => m);
  }

  // move1-4 形式の場合も配列に変換
  const moveFields = ['move1', 'move2', 'move3', 'move4'];
  const movesFromFields = moveFields
    .map(f => obj[f])
    .filter(m => m && typeof m === 'string' && m.trim());

  if (movesFromFields.length > 0 && !obj.moves) {
    obj.moves = movesFromFields;
  }

  // move1-4 フィールドは削除（配列に統合済み）
  // 注意: 後方互換性のため、削除するかどうかはオプション
  // moveFields.forEach(f => delete obj[f]);

  // ribbons: カンマ区切り文字列 → 配列
  if (obj.ribbons && typeof obj.ribbons === 'string') {
    obj.ribbons = obj.ribbons.split(',').map(r => r.trim()).filter(r => r);
  }

  // ribbon1-3 形式の場合も配列に変換
  const ribbonFields = ['ribbon1', 'ribbon2', 'ribbon3'];
  const ribbonsFromFields = ribbonFields
    .map(f => obj[f])
    .filter(r => r && typeof r === 'string' && r.trim());

  if (ribbonsFromFields.length > 0 && !obj.ribbons) {
    obj.ribbons = ribbonsFromFields;
  }

  // ot: 多言語対応（ot_ja, ot_en, ot_la → オブジェクト）
  const otFields = { ja: obj.ot_ja, en: obj.ot_en, la: obj.ot_la };
  const hasMultiLangOt = Object.values(otFields).some(v => v);

  if (hasMultiLangOt) {
    const otObj = {};
    for (const [lang, value] of Object.entries(otFields)) {
      if (value) {
        otObj[lang] = value;
      }
    }
    obj.ot = otObj;
    delete obj.ot_ja;
    delete obj.ot_en;
    delete obj.ot_la;
  }
}

/**
 * クリップボードにコピー用のダイアログを表示
 */
function showJsonInDialog() {
  const jsonString = exportAllSheetsToJson();

  const html = HtmlService.createHtmlOutput(`
    <textarea id="json" style="width:100%;height:400px;font-family:monospace;font-size:12px;">${escapeHtml(jsonString)}</textarea>
    <br><br>
    <button onclick="copyToClipboard()">クリップボードにコピー</button>
    <script>
      function copyToClipboard() {
        const textarea = document.getElementById('json');
        textarea.select();
        document.execCommand('copy');
        alert('コピーしました');
      }
    </script>
  `)
    .setWidth(600)
    .setHeight(500);

  SpreadsheetApp.getUi().showModalDialog(html, 'JSON エクスポート');
}

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * カスタムメニューを追加
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Pokemon Export')
    .addItem('JSONエクスポート（Driveに保存）', 'exportAllSheetsToJson')
    .addItem('JSONエクスポート（ダイアログ表示）', 'showJsonInDialog')
    .addSeparator()
    .addItem('データ検証', 'validateData')
    .addToUi();
}

/**
 * データ検証
 */
function validateData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const errors = [];

  for (const sheet of ss.getSheets()) {
    const sheetName = sheet.getName();

    if (shouldExcludeSheet(sheetName)) continue;

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) continue;

    const headers = data[0].map(h => String(h).trim());
    const requiredFields = ['managementId', 'pokemonName', 'dexNo', 'generation', 'game', 'eventName', 'startDate'];

    // 必須フィールドの存在確認
    for (const field of requiredFields) {
      if (!headers.includes(field)) {
        errors.push(`[${sheetName}] 必須カラムがありません: ${field}`);
      }
    }

    // 各行のデータ検証
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 1;

      // managementIdの重複チェック用に取得
      const managementIdIdx = headers.indexOf('managementId');
      const managementId = managementIdIdx >= 0 ? row[managementIdIdx] : '';

      if (!managementId) continue; // 空行はスキップ

      // 必須フィールドのチェック
      for (const field of requiredFields) {
        const idx = headers.indexOf(field);
        if (idx >= 0 && !row[idx]) {
          errors.push(`[${sheetName}] 行${rowNum}: ${field}が空です (ID: ${managementId})`);
        }
      }

      // dexNoの範囲チェック
      const dexNoIdx = headers.indexOf('dexNo');
      if (dexNoIdx >= 0) {
        const dexNo = row[dexNoIdx];
        if (dexNo && (dexNo < 1 || dexNo > 1025)) {
          errors.push(`[${sheetName}] 行${rowNum}: dexNoが範囲外です: ${dexNo}`);
        }
      }

      // generationの範囲チェック
      const genIdx = headers.indexOf('generation');
      if (genIdx >= 0) {
        const gen = row[genIdx];
        if (gen && (gen < 1 || gen > 9)) {
          errors.push(`[${sheetName}] 行${rowNum}: generationが範囲外です: ${gen}`);
        }
      }
    }
  }

  // 結果表示
  if (errors.length === 0) {
    SpreadsheetApp.getUi().alert('検証完了', 'エラーはありませんでした。', SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    const message = errors.slice(0, 20).join('\n') + (errors.length > 20 ? `\n\n...他 ${errors.length - 20}件` : '');
    SpreadsheetApp.getUi().alert('検証エラー', message, SpreadsheetApp.getUi().ButtonSet.OK);
    Logger.log('検証エラー:\n' + errors.join('\n'));
  }
}
