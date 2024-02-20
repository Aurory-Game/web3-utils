import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import fs from "fs";
async function run() {
  try {
    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();
    const connection = mcp.get("aurory-prod");
    const mint = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
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
      (v) => (v.account.data as any).parsed.info.tokenAmount.uiAmount > 200,
    );
    const formatted: Record<string, number> = {};
    nonZeroHolders.forEach((v) => {
      formatted[(v.account.data as any).parsed.info.owner] = (
        v.account.data as any
      ).parsed.info.tokenAmount.uiAmount;
    });
    const savePath = __dirname + "/../../snapshots/jup200_01-02-24.json";
    fs.writeFileSync(savePath, JSON.stringify(formatted, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();
