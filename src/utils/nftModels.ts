export enum Rarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  EPIC = "Epic",
  LEGENDARY = "Legendary",
}

export interface NftModel<
  T extends (...args: any[]) => { trait_type: string; value: any }[],
> {
  symbol: string;
  attributes: T;
  uploadCategory: string;
}

function createNftModel<
  T extends (...args: any[]) => { trait_type: string; value: any }[],
>(symbol: string, attributes: T, uploadCategory: string): NftModel<T> {
  return {
    symbol,
    attributes,
    uploadCategory,
  };
}

const collectible = createNftModel(
  "COLLECT",
  (releaseDate: string, rarity: Rarity = Rarity.COMMON) => [
    { trait_type: "Type", value: "Collectible" },
    { trait_type: "First Release", value: releaseDate },
    { trait_type: "Rarity", value: rarity },
  ],
  "items",
);

const skin = createNftModel(
  "SKIN",
  (nefty: string) => [
    { trait_type: "Type", value: "Skin" },
    { trait_type: "Nefty", value: nefty },
  ],
  "items",
);

const egg = createNftModel(
  "EGG",
  (origin: string) => [
    { trait_type: "Type", value: "Egg" },
    { trait_type: "Origin", value: origin },
  ],
  "eggs",
);

const pack1Kin = createNftModel(
  "PACK",
  () => [{ trait_type: "Type", value: "Pack" }],
  "shop/packs/1kin",
);

// Exporting all models in a single object
export const nftModels = {
  collectible,
  skin,
  egg,
  pack1Kin,
};
