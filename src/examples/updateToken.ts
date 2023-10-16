import { findMetadataPda } from "@metaplex-foundation/js";
import { PublicKey, Transaction } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { createUpdateMetadataAccountInstruction } from "@metaplex-foundation/mpl-token-metadata";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const authority = mwp.get("1ooMcG4CjRycd5WSW7zLbL2fxoVsts8o6JRshTUGUSW");
    const mint = new PublicKey("xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP");

    const metadataPDA = findMetadataPda(mint);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    const tx = new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: authority.publicKey,
    }).add(
      createUpdateMetadataAccountInstruction(
        {
          metadata: metadataPDA,
          updateAuthority: authority.publicKey,
        },
        {
          updateMetadataAccountArgs: {
            data: {
              name: "xAury",
              symbol: "xAUR",
              uri: "https://assets.cdn.aurory.io/aury/xaury.json",
              sellerFeeBasisPoints: 0,
              creators: null,
            },
            updateAuthority: authority.publicKey,
            primarySaleHappened: null,
          },
        },
      ),
    );
    const signature = await connection.sendTransaction(tx, [authority]);
    console.log(signature);
  } catch (e) {
    console.error(e);
  }
}

run();
