import { PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const authority = mwp.get("NFTsPae8pUuvKHiUHpXfZaQwwbiVPw6dPCWpwfvrwR6");
    const mint = new PublicKey("8nLBJaFaXcMSS2RK4YCGcHLxQuikK3aAPN1EZ3UorDW5");
    const dest = new PublicKey("qa9ZHBMtDVxgQWE3mNBjH8Pf4CeGAa33s5ZRotbympe");
    const ta = await getOrCreateAssociatedTokenAccount(
      connection,
      authority,
      mint,
      dest,
    );
    console.log(
      await mintTo(connection, authority, mint, ta.address, authority, 9),
    );
  } catch (e) {
    console.error(e);
  }
}

run();
