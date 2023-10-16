import { Connection, PublicKey, VersionedTransaction, TransactionMessage } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';

async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const authority = mwp.get("1ooMcG4CjRycd5WSW7zLbL2fxoVsts8o6JRshTUGUSW");
    const newAuthority = new PublicKey('2h6xXYjrrqTU5qUL3KQd2yMLWfUEBTguyAHwrC2FPHkS')

    const instructions = [
        createSetAuthorityInstruction(
          new PublicKey('AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP'),
          authority.publicKey,
          AuthorityType.MintTokens,
          newAuthority
        ),
        createSetAuthorityInstruction(
          new PublicKey('AURYydfxJib1ZkTir1Jn1J9ECYUtjb6rKQVmtYaixWPP'),
          authority.publicKey,
          AuthorityType.FreezeAccount,
          newAuthority
        )
    ]
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
      const txMessage = new TransactionMessage({
        payerKey: authority.publicKey,
        instructions,
        recentBlockhash: blockhash
      }).compileToV0Message()
    const vtx = new VersionedTransaction(txMessage);
    vtx.sign([authority]);
    const signature = await connection.sendTransaction(vtx);
    console.log(signature);
  } catch (e) {
    console.error(e);
  }
}

run();
