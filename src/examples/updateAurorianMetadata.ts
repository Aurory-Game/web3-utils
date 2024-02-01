import {
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  PublicKey as PublicKeyUMO,
  Umi,
  createSignerFromKeypair,
  generateSigner,
  keypairIdentity,
  keypairPayer,
  some,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { loadJsonFromUri } from "../utils/network";
import { loadJson } from "../utils/file";
import {
  fetchMetadata,
  fetchMetadataFromSeeds,
  findMetadataPda,
  findMasterEditionPda,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const authority = mwp.get("aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt");
    const payer = mwp.get("NFTsPae8pUuvKHiUHpXfZaQwwbiVPw6dPCWpwfvrwR6");
    const aurorianMintsPath = `${process.env.PROCESSED_FILES_PATH}/mint_addresses.json`;
    const aurorianMints = loadJson(aurorianMintsPath);

    // const nftMetadata: any = await loadJsonFromUri(uri);
    const mintAddresses = [
      // jean jacket
      // "68ajLfNPnvarbBnKzcE5BPRDdspb56oe2xBaoJoxzJDd",
      "Dh5a2mDmUs13gjxjCahVqPwyk4tE72WwEPzpiZ1Z3x2v",
      "68LLE4t3wiPic4MzQgcD7vTw9G2xEpwZ5bQyiztTuPrZ",
      "4Vccyr3qcqjJxNwAzbRHzzr3u23Mh7odKxJT6jqSLfoo",
      "8GeT1cmNCWF1fiTig6Gnc1FTabGtJNacHXfxsLc16NDC",
      "3LCQ3tR6vZFW8aDnvfjV5iWY8hi4Z7TnzqKaHkjpzqn7",
      "2qgD7od6gP58aMJJ38XAMw58KU5EzyHjCMQ5pfV5kn21",
      "Dw8xJcYpyXgFsj5n6ECCjkGmui85Nfm4oeURAtLZ3a3w",
      "GiQVqLmnsKxKgnV1Yfax3ux5tr9VPyZju3KWLN95rWek",
      "CnLwDpbWZqEFNHJXTn1zdBNiNZ6UTmXhpsYF5cHc51qX",
      "Eb7TCGGdzyZzHf9wduTHRSfdwENFmBMPfWRimdj36aBz",
      "ADsC7CeYK8t6Lc2rL8iFCZyfqMxjk2YfrRESGGjegF5j",
      "CrPiJWhWvVBNNjHPo65UYAHku8SkhjQJg3STyCRJMWW1",
      "8fo3ekxUmQZhD3saBivJugABH7EDWcwNRrBLVJeScjvm",
      "DHJ57xMJwXLKsqvnK7AFzuwrazPQnFwPrjDsbcCayisB",
      // overalls
      "GwTnrrT6sJYM3weh7NxUeAHZN8aPEya49KwyU2fqKyrN",
      "38VF3KYHkBdvRt7dtDRbbbEwhkvMTdzGCjvwe7XkXzit",
      "D14w6Jx7MEXewXzWPxj2TkvA7vc8V7KEWWcLDonJ8azQ",
      "GJcnewkhMd75oHs3TMzS1q8MyrTMF6y6RgcuVCtkTKrh",
      "2EJ8Vsm6L6Zt93nC43qKZZ8tvZbTbmBR9eXj367Kp7Ri",
      "6QWtNVLhc1iVNMU828WQRpAL3HB8fBEpimjiMMkSv1PW",
      "Fvt95MmSVSgA5s2WszhYsrc6Q9quUDhAFtJ3Wiyd51Me",
      "5piiSyNEKej7UrtS3MbFF3FZWwt8HAZkdVL6CX1eyJGR",
      "3zjfbgusKxi6To9e4WT83ZJWufvc7AjedgvvW28RPxME",
      "DqecahYjfAr4tYdfGQRkKr3S3oAE6vnvjE4eTh3EPgZj",
      "G5sdMhLvNnsv1UUr7FTGeBcPzNhUxz3hSSLM4DWLEJc7",
      "FqwVru16zJMxHKZqw5tGm5Atrc6SrrcUuateBVe5F1Qs",
      "BCYAmUAMvd4YEWVu3qYe2BkATtW9jVWwreSj9yhzLsRn",
      "5B6QwLXYpGLxyU9XYCYstqMGrDwPc4RDbiujSGdLaAX6",
      "Co94eVbWYHyyrZPHbCspJEYessDrtVypdcuQ2z9o37t",
      "3D5KwmsBjKJ6NaLkvrapUSHCdyHujpcPSMSHF1mmKkoK",
      "3vnVC9DxYakLcRD9iJja7YjFFCqYZckCRddTRfooJYaq",
      "H2xcWHAhxXqwx4TQwUg2VgBiGtfZMQvs2DbHkKeG9yst",
      "4XTZfwTJpBeEYRNMUuUsFiFrFejHgDSJMv5dnmu5GuBy",
      "Bx8jDBb3nzA4a2pcxUUViaY55NMtwKyNCaceCg8us2yj",
      "EZbbDjWK2NLZWGQTdidzoewegspGFtW2qULdyCMLWQ8p",
      "B376HsUjT7qLv7g18HfWCWFk6cZV283JeFfxw8Z1CEya",
      "F1X6kjqWeyub4iEJEVye5mkA7chH4Bg9oNMjd75xV5u8",
      "BDXboc5mFuEk5r2e7QjrW2HYArBekBFdx4vBaJdRCV7f",
    ];
    for (let index = 0; index < mintAddresses.length; index++) {
      console.log(mintAddresses[index], index, mintAddresses.length);
      const mintAddress = new PublicKey(
        mintAddresses[index],
      ) as any as PublicKey & PublicKeyUMO;

      const umi = createUmi(connection);
      const payerKp = umi.eddsa.createKeypairFromSecretKey(payer.secretKey);
      const authorityKp = umi.eddsa.createKeypairFromSecretKey(
        authority.secretKey,
      );
      umi.use(keypairIdentity(authorityKp));
      umi.use(keypairPayer(payerKp));

      const metadata = await fetchMetadataFromSeeds(umi, {
        mint: mintAddress,
      });
      const uriData: any = await loadJsonFromUri(metadata.uri);
      const sequence = uriData.attributes.find(
        (v: any) => v.trait_type === " sequence" || v.trait_type === "sequence",
      );
      if (!sequence) {
        return;
      }
      const newUri = `https://assets.cdn.aurory.io/aurorians/${
        sequence.value - 1
      }.json`;
      const masterEditionPda = findMasterEditionPda(umi, {
        mint: mintAddress,
      });
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const instructions = updateV1(umi, {
        mint: mintAddress,
        edition: masterEditionPda[0],
        data: some({ ...metadata, uri: newUri }),
      })
        .getInstructions()
        .map((v) => {
          return new TransactionInstruction({
            keys: v.keys.map((key) => {
              return {
                pubkey: new PublicKey(key.pubkey),
                isSigner: key.isSigner,
                isWritable: key.isWritable,
              };
            }),
            programId: new PublicKey(v.programId),
            data: v.data as any,
          });
        });
      const messageV0 = new TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions: instructions,
      }).compileToV0Message();
      const transaction = new VersionedTransaction(messageV0);
      transaction.sign([payer, authority]);
      const signature = await connection.sendTransaction(transaction);
      console.log(signature);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
