export interface Pokemon {
    id: number;
    name: {
      ja: string;
      en: string;
    };
    dexNo: number;
    generation: number;
    game: string;
    version: string;
    method: string;
    location: string;
    eventName: string;
    releaseDate: string;
    // その他必要なプロパティ
  }
  
  // サンプルデータをいくつか追加
  export const initialPokemonData: Pokemon[] = [
    {
      id: 1,
      name: {
        ja: "ピカチュウ",
        en: "Pikachu"
      },
      dexNo: 25,
      generation: 1,
      game: "ポケットモンスター スカーレット・バイオレット",
      version: "Ver.1.0.0",
      method: "シリアルコード",
      location: "ポケモンセンター",
      eventName: "映画公開記念",
      releaseDate: "2023-07-01"
    },
    // 他のサンプルデータ...
  ];
