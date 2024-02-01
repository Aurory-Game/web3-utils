import { MultiWalletProvider } from "../../modules/wallet";
import { MultiConnectionProvider } from "../../modules/connection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createTree } from "@metaplex-foundation/mpl-bubblegum";
import {
  generateSigner,
  keypairIdentity,
  keypairPayer,
} from "@metaplex-foundation/umi";
import fs from "fs";

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
    const merkleTree = generateSigner(umi);
    const builder = await createTree(umi, {
      merkleTree,
      maxDepth: 3,
      maxBufferSize: 8,
    });
    await builder.sendAndConfirm(umi);
    fs.writeFileSync(
      `${__dirname}/../../../snapshots/merkleTree_${merkleTree.publicKey.toString()}.txt`,
      merkleTree.publicKey.toString(),
    );
    console.log(merkleTree.publicKey.toString());
  } catch (e) {
    console.error(e);
  }
}

run();
