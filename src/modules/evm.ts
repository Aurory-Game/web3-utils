import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";

export const MaxUint256: BigNumber = /*#__PURE__*/ BigNumber.from(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export function encodeItemId(itemId: string): BigNumber {
  const res = [];
  for (let i = 0; i < itemId.length; i++) {
    res.push(String(itemId.charCodeAt(i)).padStart(3, "0"));
  }
  const result = BigNumber.from(res.join(""));
  if (result.gt(MaxUint256)) throw new Error("Item id is too big");
  return result;
}

export function decodeItemId(itemId: string): string {
  if(itemId.length === 64){
    return decodeHexItemId(itemId)
  }
  const res = [];
  for (let i = 0; i < itemId.length; i++) {
    res.push(String.fromCharCode(Number(itemId.slice(i * 3, i * 3 + 3))));
  }
  return res.join("").replace(/\u0000/g, "");
}

export enum SignedDataOperationType {
  DEPOSIT = 0,
  WITHDRAW = 1,
}

export function decodeHexItemId(encodedItemId: string){
  const unpaddedItemId = encodedItemId.replace(/^0+/, '');
  let originalString = '';
  for (let i = 0; i < unpaddedItemId.length; i += 2) {
      let hexPair = unpaddedItemId.substring(i, i + 2);
      originalString += String.fromCharCode(parseInt(hexPair, 16));
  }
  return `i-${originalString}`
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

export async function getSignedDataV2(
  owner: ethers.Wallet,
  messageSender: string,
  userNonce: number,
  encodedItemIds: number[],
  tokenAddress: string,
  amounts: (ethers.BigNumber | number)[],
  operationType: number,
  finalAmounts: (ethers.BigNumber | number)[]
) {
  // Ensure amounts, encodedItemIds, and finalAmounts have the same length
  if (encodedItemIds.length !== amounts.length) {
    throw new Error(
      "Arrays encodedItemIds, amounts, and finalAmounts must have the same length"
    );
  }

  const msg = ethers.utils.defaultAbiCoder.encode(
    [
      "address",
      "uint256",
      "uint256[]",
      "address",
      "uint256[]",
      "uint8",
      "uint256[]",
    ],
    [
      messageSender,
      userNonce,
      encodedItemIds,
      tokenAddress,
      amounts,
      operationType,
      finalAmounts,
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