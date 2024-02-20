import { MultiWalletProvider } from "../../modules/wallet";
import { MultiConnectionProvider } from "../../modules/connection";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  MetadataArgs,
  MetadataArgsArgs,
  mintV1,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  keypairIdentity,
  keypairPayer,
  none,
  PublicKey as PublicKeyUMI,
  TransactionBuilder,
  WrappedInstruction,
  createSignerFromKeypair,
  Keypair,
  Umi,
} from "@metaplex-foundation/umi";
import { ComputeBudgetProgram, Keypair as Keypair3 } from "@solana/web3.js";
import * as bs58 from "bs58";
import { loadJson, write } from "../../utils/file";
import { sliceIntoChunks } from "../../utils/array";
import {
  toWeb3JsTransaction,
  fromWeb3JsInstruction,
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import PromisePool from "@supercharge/promise-pool";
import cliProgress from "cli-progress";
import colors from "ansi-colors";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const payer = fromWeb3JsKeypair(
      mwp.get("NFTsPae8pUuvKHiUHpXfZaQwwbiVPw6dPCWpwfvrwR6"),
    );
    const umi = createUmi(connection);
    const payerKp = umi.eddsa.createKeypairFromSecretKey(payer.secretKey);
    umi.use(keypairIdentity(payerKp));
    umi.use(keypairPayer(payerKp));
    const merkleTreePk =
      "6zNKuAFiiecxvhWjB4CqyqrbFRhMPFaas4rU6nVnQNVE" as PublicKeyUMI;
    const nftMetadata: MetadataArgsArgs = {
      name: "Going To Space",
      uri: "https://assets.cdn.aurory.io/items/going-to-space/metadata.json",
      sellerFeeBasisPoints: 1000, // 10%
      collection: none(),
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 },
      ],
    };

    // const data = sliceIntoChunks(
    //   Object.keys(
    //     loadJson(`${__dirname}/../../../snapshots/jup200_01-02-24.json`),
    //   )
    //     .map((v) => new PublicKey(v))
    //     .filter((v) => PublicKey.isOnCurve(v)),
    //   4,
    // );
    // write(
    //   `${__dirname}/../../../snapshots/jup200_01-02-24_chunks.json`,
    //   JSON.stringify(data),
    // );
    const start = 0;
    const end = 0;
    const data: PublicKeyUMI[][] = (
      loadJson(
        `${__dirname}/../../../snapshots/jup200_01-02-24_chunks.json`,
      ) as PublicKeyUMI[][]
    ).slice(start);
    console.log(data.length);
    return;

    const batch_size = 5;
    const errors = [] as any;
    const l = data.length;
    let stopAll = false;
    process.on("SIGINT", () => {
      stopAll = true;
    });
    const b1 = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic,
    );
    let lastIndex = 0;
    b1.start(data.length, 0, {
      last: "N/A",
    });
    const { results } = await PromisePool.withConcurrency(batch_size)
      .for(data)
      .handleError(async (error, holders) => {
        console.error(error.message, holders[0]);
        errors.push({ holders, error: error.message });
      })
      .process(async (holders, index, pool) => {
        if (stopAll) {
          if (index < lastIndex || !lastIndex) lastIndex = index;
          return ``;
        }
        if (index % (batch_size * 10) == 0 || index == l) b1.update(index);
        {
          return await sendAirdrop(
            umi,
            payer,
            merkleTreePk,
            holders,
            nftMetadata,
          );
        }
      });
    b1.stop();
    write(
      `${__dirname}/../../../snapshots/jup-airdrop-results_${start}_${end}.json`,
      JSON.stringify(lastIndex ? results.slice(0, lastIndex) : results),
    );
    console.log("end", lastIndex, "`\n");
    const errors_save = `${__dirname}/../../../snapshots/jup-airdrop-errors.json`;
    errors.length && write(errors_save, JSON.stringify(errors, null, 2));
    process.exit();
  } catch (e) {
    console.error(e);
  }
}

async function sendAirdrop(
  umi: Umi,
  payer: Keypair,
  merkleTreePk: PublicKeyUMI,
  holders: PublicKeyUMI[],
  nftMetadata: MetadataArgsArgs,
): Promise<string> {
  let txBuilder = new TransactionBuilder();
  txBuilder = txBuilder.add({
    instruction: fromWeb3JsInstruction(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
    ),
    signers: [createSignerFromKeypair(umi, payer)],
    bytesCreatedOnChain: 0,
  } as WrappedInstruction);
  for (const holder of holders) {
    // const holder = Keypair3.generate().publicKey.toBase58() as PublicKeyUMI;
    txBuilder = txBuilder.add(
      mintV1(umi, {
        leafOwner: holder,
        merkleTree: merkleTreePk,
        metadata: nftMetadata,
      }),
    );
  }
  return bs58.encode(
    await txBuilder.send(umi, {
      skipPreflight: true,
    }),
  );
}

run();
