export interface Pokemon {
  managementId: string;
  pokemonName: string;
  dexNo: number;
  generation: number;
  game: string;
  distributionMethod: string;
  distributionLocation: string;
  eventName: string;
  startDate: string;
  endDate?: string;
  shiny?: string;
  ot?: string;
  trainerId?: string | number;
  metLocation?: string;
  ball?: string;
  level?: number;
  gender?: string;
  ability?: string;
  nature?: string;
  gigantamax?: string;
  teraType?: string;
  heldItem?: string;
  move1?: string;
  move2?: string;
  move3?: string;
  move4?: string;
  ribbon1?: string;
  ribbon2?: string;
  ribbon3?: string;
  notes?: string;
  timestamp?: string;
}

// 初期データの定義
export const initialPokemonData: Pokemon[] = [
  {
    managementId: "08O01",
    pokemonName: "ニャース",
    shiny: "",
    dexNo: 52,
    generation: 8,
    game: "ソード, シールド",
    eventName: "早期購入特典",
    distributionMethod: "オンライン",
    distributionLocation: "オンライン",
    startDate: "2019-11-14",
    endDate: "2020-01-14",
    ot: "(プレイヤーのもの)",
    trainerId: "(プレイヤーのもの)",
    metLocation: "オンラインプレゼント",
    ball: "プレシャスボール",
    level: 5,
    gender: "ランダム",
    ability: "ものひろい",
    nature: "ランダム",
    gigantamax: "キョダイマックス",
    teraType: "",
    heldItem: "ねこだまし",
    move1: "なきごえ",
    move2: "きりさく",
    move3: "ネコにこばん",
    move4: "",
    ribbon1: "クラシックリボン",
    ribbon2: "",
    ribbon3: "",
    notes: "",
    timestamp: "2025-03-23T14:52:48.484Z",
  },
  {
    managementId: "08D01",
    pokemonName: "ミュウ",
    shiny: "",
    dexNo: 151,
    generation: 8,
    game: "ソード, シールド",
    eventName: "モンスターボール Plus",
    distributionMethod: "モンスターボール Plus",
    distributionLocation: "モンスターボール Plus",
    startDate: "2019-11-14",
    endDate: "",
    ot: "(プレイヤーのもの)",
    trainerId: "(プレイヤーのもの)",
    metLocation: "モンスターボール Plus",
    ball: "モンスターボール",
    level: 1,
    gender: "なし",
    ability: "シンクロ",
    nature: "ランダム",
    gigantamax: "",
    teraType: "",
    heldItem: "はたく",
    move1: "",
    move2: "",
    move3: "",
    move4: "",
    ribbon1: "",
    ribbon2: "",
    ribbon3: "",
    notes: "",
    timestamp: "2025-03-23T15:02:52.346Z",
  },
  {
    managementId: "08P01",
    pokemonName: "ピカチュウ",
    shiny: "",
    dexNo: 25,
    generation: 8,
    game: "ソード, シールド",
    eventName: "ポケモンセンターわくわくおたんじょうび",
    distributionMethod: "シリアルコード",
    distributionLocation: "ポケモンセンター",
    startDate: "2019-11-14",
    endDate: "2021-01-30",
    ot: "ポケセン",
    trainerId: 191115,
    metLocation: "ポケモンセンター",
    ball: "プレシャスボール",
    level: 5,
    gender: "♂",
    ability: "せいでんき",
    nature: "まじめ",
    gigantamax: "",
    teraType: "",
    heldItem: "おいわい",
    move1: "なかよくする",
    move2: "でんきショック",
    move3: "でんこうせっか",
    move4: "",
    ribbon1: "バースデーリボン",
    ribbon2: "",
    ribbon3: "",
    notes: "",
    timestamp: "2025-03-23T15:06:07.118Z",
  },
  {
    managementId: "08P02",
    pokemonName: "イーブイ",
    shiny: "",
    dexNo: 133,
    generation: 8,
    game: "ソード, シールド",
    eventName: "ポケモンセンターわくわくおたんじょうび",
    distributionMethod: "シリアルコード",
    distributionLocation: "ポケモンセンター",
    startDate: "2019-11-14",
    endDate: "2021-01-30",
    ot: "ポケセン",
    trainerId: 191115,
    metLocation: "ポケモンセンター",
    ball: "プレシャスボール",
    level: 5,
    gender: "♂",
    ability: "にげあし",
    nature: "すなお",
    gigantamax: "",
    teraType: "",
    heldItem: "おいわい",
    move1: "ほしがる",
    move2: "てだすけ",
    move3: "たいあたり",
    move4: "",
    ribbon1: "バースデーリボン",
    ribbon2: "",
    ribbon3: "",
    notes: "",
    timestamp: "2025-03-23T15:07:06.933Z",
  },
];
