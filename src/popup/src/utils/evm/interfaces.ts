import BigNumber from "bignumber.js";
import { BytesLike } from "ethers";
import { EVMNetwork, EVMAssetType, EVMAssetId } from "../../networks/evm";

export interface TokenData {
  balances: Balance[];
}
export interface ethereumHoldingState {
  list: TokenData[];
}

export interface Balance {
  contractAddress: string;
  amount: string;
}

export interface IEVMAsset {
  name: string;
  symbol: string;
  decimal: number;
  assetType: EVMAssetType;
  network?: EVMNetwork;
  contractAddress?: string;
  assetId?: EVMAssetId;
}

export interface IEVMAssetERC20 extends IEVMAsset {
  contractAddress: string;
}

export interface IEVMNetwork {
  isTestnet?: boolean;
  chainId: number;
  nodeUrl: string;
  explorerUrlAddress: string;
  explorerUrlTransaction: string;
  nativeCurrency?: string;
}

export interface IEVMBuildTransactionOnChainParam {
  nonce: BigNumber;
  gasPriceInGwei: BigNumber;
  nativeCurrenyBalance: BigNumber;
  assetBalance: BigNumber;
}

export interface IEVMBuildTransaction {
  network: EVMNetwork;
  asset: IEVMAssetERC20;
  amount: BigNumber;
  fromAddress: string;
  toAddress: string;
  nonce: BigNumber;
  gasPriceInGwei: BigNumber;
  gasLimit?: BigNumber;
  numOfPendingTransaction?: BigNumber; // TODO for adding up nonce, blocked by cache pending txn
}

export interface IEVMToBeSignTransaction {
  to: string;
  from: string;
  nonce: string;
  gasLimit: string;
  gasPrice: string;
  data?: BytesLike;
  value: string;
  chainId: number;
  type?: number;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  customData?: Record<string, any>;
  ccipReadEnabled?: boolean;
}

export interface Response {
  success: boolean;
  message: string;
}

export interface IEVMHistoricalTransaction {
  assetId: string;
  amount: BigNumber;
  from: string;
  fee: BigNumber;
  to: string;
  nonce: BigNumber;
  blockNumber: BigNumber;
  transactionHash: string;
  timestamp: number;
}
