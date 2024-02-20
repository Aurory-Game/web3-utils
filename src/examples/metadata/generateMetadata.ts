import { MultiWalletProvider } from "../../modules/wallet";
import * as fs from "fs";
import { write } from "../../utils/file";
import { NftModel } from "../../utils/nftModels";

export async function generateMetadata(
  cm: NftModel<any>,
  name: string,
  description: string,
  attributes: any,
) {
  try {
    const symbol = cm.symbol;
    const collectionName = "Aurory";
    const keyBase = encodeURIComponent(
      name.toLowerCase().trim().replace(/\s/g, "-"),
    );
    console.log(keyBase);

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
