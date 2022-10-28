import { IEVMAssetERC20, IEVMAsset, IEVMHistoricalTransaction } from "../interfaces";
import BigNumber from "bignumber.js";
import { EVMNetwork, EVMAssetId, EVMAssetType, assets } from "networks/evm";
import { getProvider, toCheckSumAddress } from "..";

export interface IAlchemyTransferParam {
  fromAddress: string;
  fromBlock: string;
  toBlock: string;
  category: string[];
  withMetadata: boolean;
  excludeZeroValue: boolean;
  contractAddresses?: string[];
}

export interface IAlchemyTransferObject {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number;
  erc721TokenId: string | null;
  erc1155Metadata: string | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string | null;
    decimal: string;
  };
}

const getApiUrl = (networkId: EVMNetwork): string => {
  switch (networkId) {
    case EVMNetwork.ETHEREUM:
      return `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`;
    case EVMNetwork.ETHEREUM_TESTNET_GOERLI:
      return `https://eth-goerli.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`;
    default:
      throw new Error("Non Supported Network");
  }
};

export const getHistoricalTransactions = async (
  address: string,
  networkId: EVMNetwork,
  assetId: EVMAssetId,
  fromBlock?: BigNumber,
): Promise<IEVMHistoricalTransaction[]> => {
  const startTime = Date.now();
  try {
    const historicalTransactions: IEVMHistoricalTransaction[] = [];
    const asset: IEVMAsset | IEVMAssetERC20 = assets[assetId];
    let category: string[];
    let contractAddresses: string[];
    switch (assets[assetId].assetType) {
      case EVMAssetType.NATIVE: {
        category = ["internal", "external"];
        contractAddresses = [];
        break;
      }
      case EVMAssetType.ERC20: {
        category = ["erc20"];
        contractAddresses = [(asset as IEVMAssetERC20).contractAddress];
        break;
      }
      default:
        category = [];
        contractAddresses = [];
    }
    let param: IAlchemyTransferParam = {
      fromBlock: fromBlock?.isFinite() ? `0x${fromBlock.toString(16)}` : "0x0",
      toBlock: "latest",
      category: category,
      withMetadata: false,
      excludeZeroValue: false,
      fromAddress: address,
    };
    if (asset.assetType !== EVMAssetType.NATIVE) {
      param = {
        ...param,
        contractAddresses,
      };
    }
    const options = {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [param],
      }),
    };

    const provider = getProvider(networkId);
    const res = await fetch(getApiUrl(networkId), options);
    const data = await res.json();
    if (data.error) {
      throw data.error;
    }
    do {
      for (const transfer of data.result.transfers) {
        const transferObj: IEVMHistoricalTransaction = {
          assetId: assetId.toString(),
          amount: new BigNumber(transfer.value),
          from: toCheckSumAddress(transfer.from),
          to: toCheckSumAddress(transfer.to),
          fee: new BigNumber(0),
          nonce: new BigNumber(0),
          blockNumber: new BigNumber(transfer.blockNumber),
          transactionHash: transfer.hash,
          timestamp: 0,
        };
        historicalTransactions.push(transferObj);
      }
    } while (data.result.pageKey);
    // TODO remove log
    console.log("TimeTaken 1 - ", Date.now() - startTime);
    const chunkSize = 20;
    for (let i = 0; i < historicalTransactions.length; i += chunkSize) {
      const chunk = historicalTransactions.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (historicalTransaction) => {
          const transaction = await provider.getTransaction(historicalTransaction.transactionHash);
          // const transactionReceipt = await provider.getTransactionReceipt(historicalTransaction.transactionHash);
          // historicalTransaction.fee = new BigNumber(transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice)._hex);
          // historicalTransaction.nonce = new BigNumber(transaction.nonce);
          historicalTransaction.timestamp = transaction.timestamp ? transaction.timestamp : 0;
        }),
      );
    }
    // TODO remove log
    console.log("TimeTaken 2 - ", Date.now() - startTime);
    return historicalTransactions;
  } catch (err) {
    console.log("Failed to getHistoricalTransactionsByAlchemy", err);
    throw err;
  }
};
