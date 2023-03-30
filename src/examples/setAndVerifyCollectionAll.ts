import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { MultiWalletProvider } from "../modules/wallet";
import { MultiConnectionProvider } from "../modules/connection";
import { NFTsOperator } from "../modules/nfts";
import * as file from '../utils/file'
import { PromisePool } from '@supercharge/promise-pool'
import { sliceIntoChunks } from '../utils/array'
import { askTryAgain } from '../utils/tryAgain'

interface SignatureWithMint {
  signature: string;
  mint: PublicKey;
}

type SignatureMintError = SignatureWithMint & { err: any }


async function setAllAndSaveErrors(mints: PublicKey[], no: NFTsOperator, collectionAddress: PublicKey, updateAuthority: Keypair): Promise<SignatureWithMint[]> {
  const { results, errors } = await PromisePool
    .for(mints)
    .withConcurrency(10)
    .onTaskFinished((mint: PublicKey, pool: any) => {
      const count = pool.processedCount()
      count % 100 === 0 && console.log(count, '/', mints.length)
    })
    .process(async (mint: PublicKey, index: number, pool) => {
      const signature = await no.setAndVerifyCollection(mint, collectionAddress, updateAuthority);
      return { signature, mint } as SignatureWithMint
    })
  const resultsWithStringifiedMints = results.map(r => Object.assign(r, { mint: r.mint.toString() }))
  file.writeJson({
    path: 'out/set_collection_txs.json',
    data: resultsWithStringifiedMints,
    addTs: true
  })
  errors.length && file.writeJson({
    path: 'out/set_collection_errors.json',
    data: errors,
    addTs: true
  })
  return results
}

async function verifyAllTxs(connection: Connection, signatureWithMints: SignatureWithMint[][]): Promise<SignatureMintError[]> {
  console.log('Verifying txs')
  const { results, errors } = await PromisePool
    .for(signatureWithMints)
    .withConcurrency(1000)
    .onTaskFinished((signatureWithMint: SignatureWithMint[], pool: any) => {
      const count = pool.processedCount()
      count % 10 === 0 && console.log(count, '/', signatureWithMints.length)
    })
    .process(async (signatureWithMint: SignatureWithMint[], index: number, pool) => {
      const statuses = await connection.getSignatureStatuses(signatureWithMint.map(s => s.signature), { searchTransactionHistory: true })
      const r = [] as SignatureMintError[]
      statuses.value.forEach((s, i) => {
        //@ts-ignore
        if (s?.err && s?.err.InstructionError && s?.err.InstructionError[1]?.Custom === 114) return;
        if (!s || s?.err) r.push(Object.assign({ err: s?.err }, signatureWithMint[i]))
      })
      return r
    })
  errors.length && file.writeJson({
    path: 'out/set_collection_verify_txs_errors.json',
    data: errors,
    addTs: true
  })
  return results.flat()
}

async function run() {
  try {

    const mwp = new MultiWalletProvider();
    const mcp = new MultiConnectionProvider();

    const connection = mcp.get('aurory-prod');

    const updateAuthority = mwp.get('aury7LJUae7a92PBo35vVbP61GX8VbyxFKausvUtBrt');
    const collectionAddress = new PublicKey('7BQdHnBKERaCYCnwLbbSoYHQZxcq7zLenYERDp94o18z')

    const no = new NFTsOperator(connection)

    let mints = file.loadJson('deps/mint_addresses.json').map((a: string) => new PublicKey(a))
    let tryAgain = true;
    while (tryAgain) {
      tryAgain = false;
      const results = await setAllAndSaveErrors(mints, no, collectionAddress, updateAuthority)

      // Waiting 1min
      console.log('Waiting 1min before verifying txs')
      await new Promise((resolve) => setTimeout(resolve, 60 * 1000))

      // const fakeResults = [
      //   { signature: "rnbrSK8m4sAsSpbdZcNTjxzTGHPLefNNkUDbYwadQ6jnaMTPUgeY4MZAk8r5PSjL34tpmW6auMwfXnqViqJk62C", mint: new PublicKey("5CsvtwfXt97RBrEJFXP5eyjpHtvqTuk1A8ezrfy5x4fR") },
      // ] as SignatureWithMint[]
      // const repeat = <T>(arr: T[], n: any): T[] => Array(n).fill(arr).flat()
      // const fails = await verifyAllTxs(connection, sliceIntoChunks(repeat(fakeResults, 10000), 255));

      const fails = await verifyAllTxs(connection, sliceIntoChunks(results, 255));

      if (fails.length) {
        file.writeJson({
          path: 'out/set_collection_fails.json',
          data: fails,
          addTs: true
        })

        mints = fails.map(f => f.mint)
        console.log(`${fails.length} fails`)
        tryAgain = await askTryAgain()
      }
    }
  }
  catch (e) {
    console.error(e)
  }
}

run()