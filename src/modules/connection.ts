import { Connection, Commitment } from "@solana/web3.js";

export class MultiConnectionProvider {
  private _rpcs: Record<string, string>;
  constructor() {
    this._rpcs = {} as any;
    Object.entries(process.env).forEach(([address, url]) => {
      if (address.startsWith("RPC_")) {
        this._rpcs[address.replace("RPC_", "")] = url!;
      }
    });
  }

  get(name: string, commitment?: Commitment): Connection {
    return new Connection(this._rpcs[name], {
      commitment: commitment ?? "recent",
    });
  }
}
