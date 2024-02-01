import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import fs from "fs";
async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const mint = "xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP";
    const res = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      commitment: "finalized",
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 0,
            bytes: mint,
          },
        },
      ],
    });
    const nonZeroHolders = res.filter(
      (v) => (v.account.data as any).parsed.info.tokenAmount.uiAmount > 0,
    );
    const savePath = __dirname + "/../../snapshots/xAuroryHolders.json";
    fs.writeFileSync(savePath, JSON.stringify(nonZeroHolders, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
