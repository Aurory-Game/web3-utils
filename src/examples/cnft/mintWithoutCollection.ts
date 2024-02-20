import { MultiWalletProvider } from "../../modules/wallet";
import { MultiConnectionProvider } from "../../modules/connection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  keypairPayer,
  none,
  PublicKey as PublicKeyUMI,
  TransactionBuilder,
  WrappedInstruction,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import * as bs58 from "bs58";
import {
  toWeb3JsTransaction,
  fromWeb3JsInstruction,
  fromWeb3JsKeypair,
} from "@metaplex-foundation/umi-web3js-adapters";

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
    const instructions = [] as TransactionInstruction[];
    let txBuilder = new TransactionBuilder();
    for (let i = 0; i < 1; i++) {
      txBuilder = txBuilder.add(
        mintV1(umi, {
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
        }),
      );
    }
    txBuilder = txBuilder.prepend({
      instruction: fromWeb3JsInstruction(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
      ),
      signers: [createSignerFromKeypair(umi, fromWeb3JsKeypair(payer))],
      bytesCreatedOnChain: 0,
    } as WrappedInstruction);

    const tx = toWeb3JsTransaction(await txBuilder.buildAndSign(umi));
    // const { blockhash } = await connection.getLatestBlockhash();
    // const txMessage = new TransactionMessage({
    //   payerKey: payer.publicKey,
    //   instructions,
    //   recentBlockhash: blockhash,
    // }).compileToV0Message();
    // const vtx = new VersionedTransaction(txMessage);
    // vtx.sign([payer]);
    const signature = await connection.sendTransaction(tx);
    console.log(`https://xray.helius.xyz/tx/${signature}?network=mainnet`);
    // .sendAndConfirm(umi);
    // console.log(
    //   `https://xray.helius.xyz/tx/${bs58.encode(
    //     result.signature,
    //   )}?network=mainnet`,
    // );
  } catch (e) {
    console.error(e);
  }
}

run();
