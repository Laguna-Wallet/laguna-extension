import BigNumber from "bignumber.js";
import { BytesLike } from "ethers";
import { EVMNetwork } from "./networks";
import { EVMAssetType } from "./networks/asset";

 
 export interface ethereumHoldingState {
    list: TokenData[]
 }

 export interface TokenData {
    balances: Balance[];
 }

 export interface Balance {
  contractAddress: string
  amount: string
 }

 export interface IEVMNetwork {
   chainId: number;
   nodeUrl: string;
   explorerUrlAddress: string;
   explorerUrlTransaction: string;
 }
 
export interface IEVMAsset {
  name: string;
  symbol: string;
  decimal: number;
  assetType: EVMAssetType;
}

export interface IEVMAssetERC20 extends IEVMAsset {
  contractAddress: string;
}

export interface IEVMBuildTransaction {
  network: EVMNetwork, 
  asset: IEVMAssetERC20, 
  amount: BigNumber, 
  fromAddress: string, 
  toAddress: string, 
  gasPriceInGwei: BigNumber,
  numOfPendingTransaction: BigNumber, // TODO for adding up nonce, blocked by cache pending txn
}

export interface TransactionState {
  success: boolean,
  transfers: Transfer[] | null
}

export interface TransfersList {
  id: number,
  jsonrpc: string,
  result: Result
}

export interface Result {
  pageKey: string,
  transfers: Transfer[]
}

export interface Transfer {
  blockNum: string,
  uniqueId: string,
  hash: string,
  from: string,
  to: string,
  value: number,
  erc721TokenId: string | null,
  erc1155Metadata: string | null,
  tokenId: string | null,
  asset: string,
  category: string
  rawContract: RawContract
}

export interface RawContract {
  value: string,
  address: string | null,
  decimal: string
}

export interface IEVMToBeSignTransaction {
  to: string,
  from: string,
  nonce: string,
  gasLimit: string,
  gasPrice: string,
  data?: BytesLike,
  value: string,
  chainId: number
  type?: number;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  customData?: Record<string, any>;
  ccipReadEnabled?: boolean;
}

export interface Response {
  success: boolean,
  message: string
}
