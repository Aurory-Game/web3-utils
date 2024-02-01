export enum Rarity {
  Common = "Common",
  Uncommon = "Uncommon",
  Rare = "Rare",
  Epic = "Epic",
  Legendary = "Legendary",
}

export interface NftModel {
  symbol: string;
  attributes: (...args: any) => { trait_type: string; value: any }[];
  uploadCategory: string;
}

export const nftModels: Record<string, NftModel> = {
  collectible: {
    symbol: "COLLECT",
    // releaseDate is in the form of 01/23
    attributes: (releaseDate: string, rarity = Rarity.Common) => [
      {
        trait_type: "Type",
        value: "Collectible",
      },
      {
        trait_type: "First Release",
        value: releaseDate,
      },
      {
        trait_type: "First Release",
        value: releaseDate,
      },
    ],
    uploadCategory: "items",
  },
  skin: {
    symbol: "SKIN",
    attributes: (nefty: string) => [
      {
        trait_type: "Type",
        value: "Skin",
      },
      {
        trait_type: "Nefty",
        value: nefty,
      },
    ],
    uploadCategory: "items",
  },
  egg: {
    symbol: "EGG",
    attributes: (origin: string) => [
      {
        trait_type: "Type",
        value: "Egg",
      },
      {
        trait_type: "Origin",
        value: origin,
      },
    ],
    uploadCategory: "eggs",
  },
  pack1Kin: {
    symbol: "PACK",
    attributes: () => [
      {
        trait_type: "Type",
        value: "Pack",
      },
    ],
    uploadCategory: "shop/packs/1kin",
  },
};
