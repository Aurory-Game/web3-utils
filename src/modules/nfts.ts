import { findMasterEditionV2Pda, findMetadataPda } from "@metaplex-foundation/js";
import { PublicKey, Transaction, Connection, Keypair } from '@solana/web3.js';
import { createSetAndVerifySizedCollectionItemInstruction, createUnverifyCollectionInstruction } from '@metaplex-foundation/mpl-token-metadata';

export class NFTsOperator {
  private _co: Connection;
  constructor(connection: Connection) {
    this._co = connection
  }

  async setAndVerifyCollection(nftAddress: PublicKey, collectionAddress: PublicKey, nftAuthority: Keypair, collectionAuthority?: Keypair, feePayer?: Keypair, skipPreflight: boolean = true): Promise<string> {
    const metadataAccount = findMetadataPda(nftAddress);
    const collectionMetadataAccount = findMetadataPda(collectionAddress);
    const collectionMasterEdition = findMasterEditionV2Pda(collectionAddress);

    const payer = feePayer ?? nftAuthority;
    const collectionAuth = collectionAuthority ?? nftAuthority;

    const { blockhash, lastValidBlockHeight } = await this._co.getLatestBlockhash();
    const tx = new Transaction({ blockhash, lastValidBlockHeight, feePayer: payer.publicKey })
      .add(createSetAndVerifySizedCollectionItemInstruction({
        metadata: metadataAccount,
        collectionAuthority: collectionAuth.publicKey,
        payer: payer.publicKey,
        updateAuthority: nftAuthority.publicKey,
        collectionMint: collectionAddress,
        collection: collectionMetadataAccount,
        collectionMasterEditionAccount: collectionMasterEdition,
      }))
    return await this._co.sendTransaction(tx, [payer, nftAuthority, collectionAuth], { skipPreflight })
  }

  async unverifyCollection(nftAddress: PublicKey, collectionAddress: PublicKey, nftAuthority: Keypair, collectionAuthority?: Keypair, feePayer?: Keypair, skipPreflight: boolean = true): Promise<string> {
    const metadataAccount = findMetadataPda(nftAddress);
    const collectionMetadataAccount = findMetadataPda(collectionAddress);
    const collectionMasterEdition = findMasterEditionV2Pda(collectionAddress);

    const payer = feePayer ?? nftAuthority;
    const collectionAuth = collectionAuthority ?? nftAuthority;

    const { blockhash, lastValidBlockHeight } = await this._co.getLatestBlockhash();
    const tx = new Transaction({ blockhash, lastValidBlockHeight, feePayer: payer.publicKey })
      .add(createUnverifyCollectionInstruction({
        metadata: metadataAccount,
        collectionAuthority: collectionAuth.publicKey,
        collectionMint: collectionAddress,
        collection: collectionMetadataAccount,
        collectionMasterEditionAccount: collectionMasterEdition,
      }))
    return await this._co.sendTransaction(tx, [payer, nftAuthority, collectionAuth], { skipPreflight })
  }
}