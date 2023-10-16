import { keypairIdentity, Metaplex } from "@metaplex-foundation/js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const updateAuthority = mwp.get(
      "aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt",
    );
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(updateAuthority));

    const r = await metaplex
      .nfts()
      .create({
        isCollection: true,
        name: "Aurorians",
        uri: "https://aurory-assets.s3.amazonaws.com/collections/aurory-collection.json",
        symbol: "AUROR",
        sellerFeeBasisPoints: 0,
      })
      .run();
    console.log(r, r.nft.address.toBase58());
  } catch (e) {
    console.error(e);
  }
}

run();
