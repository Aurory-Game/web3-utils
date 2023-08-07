import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

export const MaxUint256: BigNumber = /*#__PURE__*/ BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export function encodeItemId(itemId: string): string {
  itemId = itemId.replace("i-", "");
  let hexArray = Array.from(itemId).map((char:any) => char.charCodeAt(0).toString(16));
  let hexString = hexArray.join('');
  return hexString.padStart(64, '0');
}

export function decodeItemId(itemId: string): string {
   itemId = itemId.replace(/^0+/, '');
   const originalString = Array.from({ length: itemId.length / 2 })
       .map((_, idx) => {
           const hexPair = itemId.substr(idx * 2, 2);
           return String.fromCharCode(parseInt(hexPair, 16));
       })
       .join('');
   return "i-" + originalString;
}

export enum SignedDataOperationType {
  DEPOSIT = 0,
  WITHDRAW = 1,
}

export async function getSignedData(
  owner: ethers.Wallet,
  messageSender: string,
  userNonce: number,
  encodedItemId: number,
  tokenAddress: string,
  amount: BigNumber | number,
  operationType: SignedDataOperationType,
  finalAmount: BigNumber | number
) {
  const msg = ethers.utils.defaultAbiCoder.encode(
    ["address", "uint256", "uint256", "address", "uint256", "uint8", "uint256"],
    [
      messageSender,
      userNonce,
      encodedItemId,
      tokenAddress,
      amount,
      operationType,
      finalAmount,
    ]
  );
  const msgHash = ethers.utils.keccak256(msg);
  let messageHashBytes = ethers.utils.arrayify(msgHash);
  const signedMsg = await owner.signMessage(messageHashBytes);
  const sig = ethers.utils.splitSignature(signedMsg);
  const sd = {
    v: sig.v,
    r: sig.r,
    s: sig.s,
  };
  return sd;
}
