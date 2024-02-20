import { MultiConnectionProvider } from "../modules/connection";
import { loadJson, write } from "../utils/file";
import { sliceIntoChunks } from "../utils/array";
async function run() {
  const mcp = new MultiConnectionProvider();
  const connection = mcp.get("aurory-prod");
  const signatures: string[] = loadJson(
    `${__dirname}/../../snapshots/jup-airdrop-results_1_1000.json`
  );
  const signaturesChunks: string[][] = sliceIntoChunks(signatures, 256);
  let nullCount = 0;
  let i = 0;
  for (const chunk of signaturesChunks) {
    i += chunk.length;
    const statuses = await connection.getSignatureStatuses(chunk, {
      searchTransactionHistory: true,
    });
    nullCount += statuses.value.filter((s) => !s).length;
    console.log(nullCount, i, nullCount / i);
  }
  console.log(nullCount, signatures.length, nullCount / signatures.length);
}
run();
