import * as web3 from '@solana/web3.js'
import fs from 'fs'


export function loadKeypair(keypair: string): any {
  return <any>JSON.parse(fs.readFileSync(keypair).toString())
}

export function loadWallet(path: string): web3.Keypair {
  const loaded = web3.Keypair.fromSecretKey(
    new Uint8Array(loadKeypair(path)),
  );
  process.env.NODE_ENV !== 'production' ? console.log(`wallet loaded: ${loaded.publicKey}`) : null
  return loaded;
}