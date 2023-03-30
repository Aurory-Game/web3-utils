import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { MultiConnectionProvider } from "../modules/connection";

const run = async () => {
  try {
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");

    const metaplex = new Metaplex(connection);
    const mint = new PublicKey("AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP");
    const token = await metaplex.tokens().findMintByAddress(mint).run();
    console.log(token);
  } catch (e) {
    console.error(e);
    console.log("Failed to run the example");
  }
};

run();
