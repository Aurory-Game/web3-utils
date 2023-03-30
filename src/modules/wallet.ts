import { Keypair } from "@solana/web3.js";
import { loadWallet } from "../utils/wallet";

export class MultiWalletProvider {
  private _wallets: Record<string, Keypair>;
  constructor() {
    this._wallets = {};
    Object.entries(process.env).forEach(([address, filePath]) => {
      if (address.startsWith("WALLET_")) {
        this._wallets[address.replace("WALLET_", "")] = loadWallet(filePath!);
      }
    });
  }

  get(address: string): Keypair {
    return this._wallets[address];
  }
}
