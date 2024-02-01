import { MultiWalletProvider } from "../modules/wallet";
import * as fs from "fs";
import { write } from "../utils/file";
import { nftModels as models } from "../utils/nftModels";
async function run() {
  try {
    const cm = models.pack1Kin;
    const name = "1kin Booster Pack 9";
    const description =
      "This Booster Pack was created in partnership with 1KIN. This special pack contains: 1,500 Crystals, 1 Prairie Egg, 1 Everglade Egg";
    const symbol = cm.symbol;
    const collectionName = "Aurory";
    const attributes = cm.attributes();

    const keyBase = encodeURIComponent(
      name.toLowerCase().trim().replace(/\s/g, "-"),
    );

    const imageExtension = "png";
    const imageUrl = `https://images.cdn.aurory.io/${cm.uploadCategory}/${keyBase}/full.${imageExtension}`;

    const files = [
      {
        uri: imageUrl,
        type: `image/${imageExtension}`,
      },
    ];

    const mwp = new MultiWalletProvider();
    const updateAuthority = mwp.get(
      "NFTsPae8pUuvKHiUHpXfZaQwwbiVPw6dPCWpwfvrwR6",
    );

    const data = {
      name,
      symbol,
      description,
      seller_fee_basis_points: 1000,
      image: imageUrl,
      external_url: "",
      attributes,
      collection: {
        name: collectionName,
        family: "Aurory",
      },
      properties: {
        files,
        category: "image",
        creators: [
          {
            address: updateAuthority.publicKey.toString(),
            share: 100,
          },
        ],
      },
    };

    const outputFolder = `${process.env.NFT_METADATA_DIR}/${cm.uploadCategory}/${keyBase}`;
    fs.mkdirSync(outputFolder, { recursive: true });
    const savePath = `${outputFolder}/metadata.json`;
    write(savePath, JSON.stringify(data, null, 2));
    console.log(JSON.stringify(data, null, 2));
    console.log(`Saved to ${savePath}`);
  } catch (e) {
    console.error(e);
  }
}

run();
