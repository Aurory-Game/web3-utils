import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { MultiConnectionProvider } from "../modules/connection";

const run = async () => {
  try {
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");

    const metaplex = new Metaplex(connection);
    const mint = new PublicKey("AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP");
    const nft = await metaplex.nfts().findByMint(mint).run();
    console.log(nft);
  } catch (e) {
    console.error(e);
    console.log("Failed to run the example");
  }
};

run();
