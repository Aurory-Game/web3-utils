import { PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { NFTsOperator } from "../modules/nfts";
async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();

    const connection = mcp.get('aurory-prod');

    const updateAuthority = mwp.get('aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt');
    const mintAddress = new PublicKey('GGKMRcs5dFJTnreK1663CSWybYRuABmapb5M2ndavASJ')
    const collectionAddress = new PublicKey('2Doimogd1YArKJgNU3ReLD1cJG1x7C1rF1iDD5An8nNi')

    const no = new NFTsOperator(connection)
    const r = await no.unverifyCollection(mintAddress, collectionAddress, updateAuthority, updateAuthority, updateAuthority, false);

    console.log(r)
  }
  catch (e) {
    console.error(e)
  }
}

run()