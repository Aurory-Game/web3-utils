import {
  CreatorInput,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { loadJsonFromUri } from "../utils/network";
import { nftModels } from "../utils/nftModels";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const updateAuthority = mwp.get(
      "NFTsPae8pUuvKHiUHpXfZaQwwbiVPw6dPCWpwfvrwR6",
    );
    const metaplex = new Metaplex(connection);
    metaplex.use(keypairIdentity(updateAuthority));

    const name = "1kin Booster Pack 9";
    const keyBase = encodeURIComponent(
      name.toLowerCase().trim().replace(/\s/g, "-"),
    );
    const cm = nftModels.pack1Kin;
    const uri = `https://assets.cdn.aurory.io/${cm.uploadCategory}/${keyBase}/metadata.json`;
    const nftMetadata: any = await loadJsonFromUri(uri);
    console.log(nftMetadata);
    const r = await metaplex
      .nfts()
      .createSft({
        isCollection: false,
        name: nftMetadata.name,
        uri,
        symbol: nftMetadata.symbol,
        sellerFeeBasisPoints: nftMetadata.seller_fee_basis_points,
        updateAuthority: updateAuthority,
        mintAuthority: updateAuthority,
        tokenOwner: updateAuthority.publicKey,
        creators: nftMetadata.properties.creators.map(
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
      })
      .run();
    console.log(r);
    console.log(`https://solscan.io/token/${r.mintAddress.toBase58()}`);
  } catch (e) {
    console.error(e);
  }
}

run();
