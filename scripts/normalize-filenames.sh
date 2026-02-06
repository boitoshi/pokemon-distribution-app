#!/bin/bash
# ポケモン画像ファイル名をNFC正規化するスクリプト
#
# macOSはファイル名をNFD（分解形式）で保存することがあり、
# Linuxサーバーやwebサーバーとの互換性問題を引き起こす。
# このスクリプトでアップロード前にNFC（合成形式）に統一する。
#
# 使い方:
#   ./scripts/normalize-filenames.sh
#   ./scripts/normalize-filenames.sh /path/to/images

TARGET_DIR="${1:-public/images/pokemon}"

if [ ! -d "$TARGET_DIR" ]; then
    echo "エラー: ディレクトリが見つかりません: $TARGET_DIR"
    exit 1
fi

# convmvが必要
if ! command -v python3 &> /dev/null; then
    echo "エラー: python3 が必要です"
    exit 1
fi

echo "対象ディレクトリ: $TARGET_DIR"

python3 -c "
import os, sys, unicodedata

d = sys.argv[1]
renamed = 0
skipped = 0

for f in os.listdir(d):
    nfc = unicodedata.normalize('NFC', f)
    if f != nfc:
        src = os.path.join(d, f)
        dst = os.path.join(d, nfc)
        if os.path.exists(dst):
            print(f'  スキップ（同名ファイルが存在）: {nfc}')
            skipped += 1
        else:
            os.rename(src, dst)
            print(f'  修正: {nfc}')
            renamed += 1

if renamed == 0 and skipped == 0:
    print('全ファイルがNFC形式です。修正不要。')
else:
    print(f'\n完了: {renamed}件修正, {skipped}件スキップ')
" "$TARGET_DIR"
