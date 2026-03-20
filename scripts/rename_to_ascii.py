#!/usr/bin/env python3
"""
ポケモン画像ファイルを日本語ファイル名 → ASCII ファイル名にコピー・リネームするスクリプト。
出力先: public/images/pokemon_ascii/

戦略: pokemon-names.json から正式な日本語名を引き、
      ファイル名の日本語部分を「プレフィックス + 正式名 + フォームサフィックス」に分解して変換する。
      これにより「メガニウム」のように正式名が「メガ」始まりでも誤判定しない。

実行: uv run python scripts/rename_to_ascii.py
"""

import os
import re
import json
import shutil
import unicodedata
from pathlib import Path

SRC_DIR  = Path(__file__).parent.parent / "public/images/pokemon"
DST_DIR  = Path(__file__).parent.parent / "public/images/pokemon_ascii"
NAMES_JSON = Path(__file__).parent.parent.parent / "pokebros-content-hub/reference-data/pokemon-names.json"

# ---- ポケモン名データ読み込み ----
with open(NAMES_JSON, encoding="utf-8") as f:
    _names_raw = json.load(f)  # {"1": {"ja": "フシギダネ", "en": "Bulbasaur"}, ...}

def nfkc(s: str) -> str:
    """全角英数字→半角など、Unicode正規化（NFKC）を適用する。"""
    return unicodedata.normalize("NFKC", s)

# dex番号（int） → 正式日本語名（NFKC正規化済み）
DEX_TO_JA: dict[int, str] = {int(k): nfkc(v["ja"]) for k, v in _names_raw.items()}

# ---- フォームサフィックス（カッコ内文字列 → ASCII） ----
SUFFIX_MAP: dict[str, str] = {
    # リージョンフォーム
    "アローラのすがた": "alolan",
    "ガラルのすがた": "galarian",
    "ヒスイのすがた": "hisuian",
    "パルデアのすがた": "paldean",
    "パルデアのすがた・ブレイズしゅ": "paldean_blaze",
    "パルデアのすがた・コンバットしゅ": "paldean_combat",
    "パルデアのすがた・ウォーターしゅ": "paldean_water",
    # ヒヒダルマ
    "ダルマモード": "zen",
    "ダルマモード(ガラルのすがた)": "galarian_zen",
    # ジガルデ
    "10%フォルム": "10pct",
    "50%フォルム": "50pct",
    "パーフェクトフォルム": "perfect",
    # メテノ
    "コア": "core",
    "りゅうせいのすがた": "meteor",
    # ネクロズマ
    "あかつきのつばさ(月食)": "dawn_wings",
    "たそがれのたてがみ(日食)": "dusk_mane",
    "ウルトラネクロズマ": "ultra",
    # バドレックス
    "はくばじょうのすがた": "ice_rider",
    "こくばじょうのすがた": "shadow_rider",
    # ガチグマ
    "あかつき": "bloodmoon",
    # イッカネズミ
    "3ひきかぞく": "3fam",
    "4ひきかぞく": "4fam",
    # ロトム
    "ヒートロトム": "heat",
    "ウォッシュロトム": "wash",
    "フロストロトム": "frost",
    "スピンロトム": "fan",
    "カットロトム": "mow",
    # ピカチュウキャップ
    "オリジナルキャップ": "original_cap",
    "ホウエンキャップ": "hoenn_cap",
    "シンオウキャップ": "sinnoh_cap",
    "イッシュキャップ": "unova_cap",
    "カロスキャップ": "kalos_cap",
    "アローラキャップ": "alola_cap",
    "キミにきめたキャップ": "i_choose_you_cap",
    "ワールドキャップ": "world_cap",
    # デオキシス
    "ノーマルフォルム": "normal",
    "アタックフォルム": "attack",
    "ディフェンスフォルム": "defense",
    "スピードフォルム": "speed",
    # ミノマダム
    "くさきのミノ": "grass",
    "すなちのミノ": "sand",
    "ゴミのミノ": "trash",
    # カラナクシ / トリトドン
    "にしのうみ": "west",
    "ひがしのうみ": "east",
    # ディアルガ / パルキア / ギラティナ
    "オリジンフォルム": "origin",
    "アナザーフォルム": "another",
    # シェイミ
    "ランドフォルム": "land",
    "スカイフォルム": "sky",
    # バスラオ
    "あかすじのすがた": "red_stripe",
    "あおすじのすがた": "blue_stripe",
    "しろすじのすがた": "white_stripe",
    # シキジカ / メブキジカ
    "はるのすがた": "spring",
    "なつのすがた": "summer",
    "あきのすがた": "autumn",
    "ふゆのすがた": "winter",
    # 性別（カッコ付き表記）
    "オスのすがた": "male",
    "メスのすがた": "female",
    "オスの姿": "male",
    "メスの姿": "female",
    # トルネロス / ボルトロス / ランドロス / ラブトロス
    "けしんフォルム": "incarnate",
    "れいじゅうフォルム": "therian",
    # キュレム
    "ブラックキュレム": "black",
    "ホワイトキュレム": "white",
    # ケルディオ
    "いつものすがた": "ordinary",
    "かくごのすがた": "resolute",
    # メロエッタ
    "ボイスフォルム": "aria",
    "ステップフォルム": "pirouette",
    # フラエッテ
    "えいえんのはな": "eternal",
    # ギルガルド
    "シールドフォルム": "shield",
    "ブレードフォルム": "blade",
    # フーパ
    "いましめられしフーパ": "confined",
    "ときはなたれしフーパ": "unbound",
    # オドリドリ
    "めらめらスタイル": "pau",
    "まいまいスタイル": "baile",
    "ぱちぱちスタイル": "pom_pom",
    "ふらふらスタイル": "sensu",
    # ルガルガン
    "まひるのすがた": "midday",
    "まよなかのすがた": "midnight",
    "たそがれのすがた": "dusk",
    # ヨワシ
    "たんどくのすがた": "solo",
    "むれたすがた": "school",
    # ストリンダー
    "ハイなすがた": "high",
    "ローなすがた": "low",
    # コオリッポ
    "アイスフェイス": "ice_face",
    "ナイスフェイス": "nice_face",
    # モルペコ
    "はらぺこもよう": "hangry",
    "まんぷくもよう": "full_belly",
    # ザシアン / ザマゼンタ
    "れきせんのゆうしゃ": "hero",
    "けんのおう": "crowned_sword",
    "たてのおう": "crowned_shield",
    # ウーラオス
    "いちげきのかた": "single_strike",
    "れんげきのかた": "rapid_strike",
    # イキリンコ
    "イエローフェザー": "yellow",
    "グリーンフェザー": "green",
    "ブルーフェザー": "blue",
    "ホワイトフェザー": "white",
    # イルカマン
    "ナイーブフォルム": "naive",
    "マイティフォルム": "mighty",
    # シャリタツ
    "そったすがた": "curly",
    "たれたすがた": "droopy",
    "のびたすがた": "stretchy",
    # コレクレー
    "とほフォルム": "roaming",
    "はこフォルム": "chest",
    # オーガポン
    "みどりのめん": "teal",
    "いしずえのめん": "cornerstone",
    "いどのめん": "wellspring",
    "かまどのめん": "hearthflame",
    # テラパゴス
    "テラスタルフォルム": "terastal",
    "ステラフォルム": "stellar",
}


def make_ascii_name(dex_int: int, dex_padded: str, ja: str) -> str | None:
    """
    正式日本語名（pokemon-names.json）を基準に、ファイル名の日本語部分を分解してASCII名を生成する。
    正式名が「メガ」「キョダイ」等で始まる場合も誤判定しない。
    """
    base_ja = DEX_TO_JA.get(dex_int)
    if base_ja is None:
        return None  # 図鑑番号が範囲外

    esc = re.escape(base_ja)

    # ---- 通常姿 ----
    if ja == base_ja:
        return dex_padded

    # ---- ♀/♂ 記号（カッコなし性別違い: パフュートン等） ----
    if ja == f"{base_ja}♀":
        return f"{dex_padded}_female"
    if ja == f"{base_ja}♂":
        return f"{dex_padded}_male"

    # ---- キョダイマックス ----
    if ja == f"キョダイマックス{base_ja}":
        return f"{dex_padded}_gmax"
    if m := re.fullmatch(rf"キョダイマックス{esc}\((.+)\)", ja):
        s = SUFFIX_MAP.get(m.group(1))
        return f"{dex_padded}_gmax_{s}" if s else None

    # ---- ゲンシカイキ（プライマル） ----
    if ja == f"ゲンシ{base_ja}":
        return f"{dex_padded}_primal"

    # ---- メガシンカ X / Y / Z ----
    for v in ("X", "Y", "Z"):
        if ja == f"メガ{base_ja}{v}":
            return f"{dex_padded}_mega_{v.lower()}"
        # メガ + バリアント + フォーム（例: メガ○○X（△△のすがた））
        if m := re.fullmatch(rf"メガ{esc}{re.escape(v)}\((.+)\)", ja):
            s = SUFFIX_MAP.get(m.group(1))
            return f"{dex_padded}_mega_{v.lower()}_{s}" if s else None

    # ---- メガシンカ（通常） ----
    if ja == f"メガ{base_ja}":
        return f"{dex_padded}_mega"
    if m := re.fullmatch(rf"メガ{esc}\((.+)\)", ja):
        s = SUFFIX_MAP.get(m.group(1))
        return f"{dex_padded}_mega_{s}" if s else None

    # ---- フォーム違い（カッコ付き、ネストしたカッコ含む） ----
    if m := re.fullmatch(rf"{esc}\((.+)\)", ja):
        form_key = m.group(1)
        s = SUFFIX_MAP.get(form_key)
        return f"{dex_padded}_{s}" if s else None

    return None  # 未対応パターン


def rename_all() -> None:
    DST_DIR.mkdir(parents=True, exist_ok=True)

    ok:  list[tuple[str, str]] = []
    ng:  list[str] = []

    for fname in sorted(os.listdir(SRC_DIR)):
        if not fname.endswith(".png"):
            continue

        m = re.match(r"^(\d{4})_(.+)\.png$", fname)
        if not m:
            ng.append(f"パース失敗: {fname}")
            continue

        dex_padded = m.group(1)
        dex_int    = int(dex_padded)
        ja         = nfkc(m.group(2))

        ascii_name = make_ascii_name(dex_int, dex_padded, ja)
        if ascii_name is None:
            ng.append(f"変換未対応: {fname}")
            continue

        dst_path = DST_DIR / f"{ascii_name}.png"
        if dst_path.exists():
            ng.append(f"重複スキップ: {fname} -> {ascii_name}.png")
            continue

        shutil.copy2(SRC_DIR / fname, dst_path)
        ok.append((fname, f"{ascii_name}.png"))

    # ---- レポート ----
    print(f"\n✅ 変換成功: {len(ok)} 件")
    for src, dst in ok[:10]:
        print(f"   {src} -> {dst}")
    if len(ok) > 10:
        print(f"   ... 他 {len(ok) - 10} 件")

    if ng:
        print(f"\n❌ 要確認: {len(ng)} 件")
        for item in ng:
            print(f"   {item}")
    else:
        print("\n要確認なし！全件変換完了 🎉")


if __name__ == "__main__":
    rename_all()
