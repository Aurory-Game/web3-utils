import { PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { NFTsOperator } from "../modules/nfts";
async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();

    const connection = mcp.get("aurory-prod");

    const updateAuthority = mwp.get(
      "aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt",
    );
    const mintAddress = new PublicKey(
      "HeL1oBX8KP9Mo2wA6H2rfgjd2JxZ2meUPHBwQqeUAZH6",
    );
    const collectionAddress = new PublicKey(
      "7BQdHnBKERaCYCnwLbbSoYHQZxcq7zLenYERDp94o18z",
    );

    const no = new NFTsOperator(connection);
    const r = await no.setAndVerifyCollection(
      mintAddress,
      collectionAddress,
      updateAuthority,
      updateAuthority,
      updateAuthority,
      false,
    );

    console.log(r);
  } catch (e) {
    console.error(e);
  }
}

run();
