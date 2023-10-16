import { Keypair } from "@solana/web3.js";
import { loadWallet } from "../utils/wallet";
import { ethers, Wallet, hexlify } from "ethers";

function run() {
  console.log("Solana");
  const wallet = loadWallet(process.env.WALLET!);
  const b64 = Buffer.from(wallet.secretKey).toString("base64");
  const decoded = Keypair.fromSecretKey(
    new Uint8Array(Buffer.from(b64, "base64"))
  );
  console.log(
    wallet.publicKey.toBase58(),
    wallet.publicKey.toBase58() === decoded.publicKey.toBase58()
  );
  console.log("Encoded pk:", Buffer.from(wallet.secretKey).toString("base64"));
}

function runEvm() {
  console.log("EVM");
  const w = Wallet.createRandom();
  console.log({ address: w.address, privateKey: w.privateKey });
  const privateKey = w.privateKey;
  const pkBytes = ethers.getBytes(privateKey);
  const pkHex = hexlify(pkBytes);
  console.log(privateKey, pkHex, privateKey == pkHex);
}

run();
runEvm();
