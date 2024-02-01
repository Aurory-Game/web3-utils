import { MultiWalletProvider } from "../../modules/wallet";
import { MultiConnectionProvider } from "../../modules/connection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  keypairPayer,
  none,
  PublicKey as PublicKeyUMI,
} from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";
import * as bs58 from "bs58";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const payer = mwp.get("2j85gueUvAFeFEdKZE5yKAvyAsU8fKKZvxX8zLbX8GCc");
    const umi = createUmi(connection);
    const payerKp = umi.eddsa.createKeypairFromSecretKey(payer.secretKey);
    umi.use(keypairIdentity(payerKp));
    umi.use(keypairPayer(payerKp));
    const merkleTreePk = new PublicKey(
      "EuSNZGtZ74Q5rHfGtXrHmotzjtgSbUkA5QyZ4tU9K3dK",
    ) as any as PublicKeyUMI;
    const result = await mintV1(umi, {
      leafOwner: new PublicKey(
        "qa9ZHBMtDVxgQWE3mNBjH8Pf4CeGAa33s5ZRotbympe",
      ) as any as PublicKeyUMI,
      merkleTree: merkleTreePk,
      metadata: {
        name: "My Compressed NFT TEST",
        uri: "https://aurory-assets.s3.amazonaws.com/items-by-name/everglade_egg/metadata.json",
        sellerFeeBasisPoints: 500, // 5%
        collection: none(),
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi);
    console.log(
      `https://xray.helius.xyz/tx/${bs58.encode(
        result.signature,
      )}?network=mainnet`,
    );
  } catch (e) {
    console.error(e);
  }
}

run();
