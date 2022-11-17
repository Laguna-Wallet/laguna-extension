import { IEVMHistoricalTransaction } from "../interfaces";
import BigNumber from "bignumber.js";
import { EVMNetwork, EVMAssetId } from "networks/evm";
// import { getProvider, toCheckSumAddress } from "..";

export const getHistoricalTransactions = async (
  address: string,
  networkId: EVMNetwork,
  assetId: EVMAssetId,
  fromBlock?: BigNumber,
): Promise<IEVMHistoricalTransaction[]> => {
  try {
    return [];
  } catch (err) {
    console.log("Failed to getHistoricalTransactionsByCovalenthq", err);
    throw err;
  }
};
