import {
  CreatorInput,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { loadJsonFromUri } from "../utils/network";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const updateAuthority = mwp.get(
      "aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt",
    );
    const mint = mwp.get("HeL1oBX8KP9Mo2wA6H2rfgjd2JxZ2meUPHBwQqeUAZH6");
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(updateAuthority));
    const aurorianCollection = new PublicKey(
      "7BQdHnBKERaCYCnwLbbSoYHQZxcq7zLenYERDp94o18z",
    );

    const uri = "https://assets.cdn.aurory.io/aurorians/10000.json";
    const aurorianData: any = await loadJsonFromUri(uri);
    const r = await metaplex
      .nfts()
      .create({
        isCollection: false,
        name: aurorianData.name,
        uri,
        symbol: aurorianData.symbol,
        sellerFeeBasisPoints: aurorianData.seller_fee_basis_points,
        updateAuthority: updateAuthority,
        mintAuthority: updateAuthority,
        useNewMint: mint,
        tokenOwner: updateAuthority.publicKey,
        creators: aurorianData.properties.creators.map(
          ({ address, share }: { address: string; share: number }) => {
            const isAuthority =
              address === updateAuthority.publicKey.toBase58();
            const creator: CreatorInput = {
              address: new PublicKey(address),
              share,
              authority: isAuthority ? updateAuthority : undefined,
            };
            return creator;
          },
        ),
        isMutable: true,
        collection: aurorianCollection,
      })
      .run();
    console.log(r, r.nft.address.toBase58());
  } catch (e) {
    console.error(e);
  }
}

run();
