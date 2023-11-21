export const nftModels = {
  collectible: {
    symbol: "COLLECT",
    // releaseDate is in the form of 01/23
    attributes: (releaseDate: string) => [
      {
        trait_type: "Type",
        value: "Collectible",
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
