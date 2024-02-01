import { MultiWalletProvider } from "../../modules/wallet";
import { MultiConnectionProvider } from "../../modules/connection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  keypairPayer,
  PublicKey as PublicKeyUMI,
} from "@metaplex-foundation/umi";
import fs from "fs";
import { PublicKey } from "@solana/web3.js";

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
    const merkleTreeAccount = await fetchMerkleTree(umi, merkleTreePk);
    console.log(merkleTreeAccount);
    const treeConfig = await fetchTreeConfigFromSeeds(umi, {
      merkleTree: merkleTreePk,
    });
    console.log(treeConfig);
  } catch (e) {
    console.error(e);
  }
}

run();
