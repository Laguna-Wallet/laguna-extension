import { IEVMAssetERC20, IEVMAsset, IEVMHistoricalTransaction } from "../interfaces";
import BigNumber from "bignumber.js";
import superagent from "superagent";
import { EVMNetwork, EVMAssetId, EVMAssetType, assets, networks } from "networks/evm";
import { getProvider, toCheckSumAddress } from "..";

export enum COVALENTHQ_API_TYPE {
  HISTORICAL_TRANSACTIONS = ":chain_id/address/:address/transactions_v2",
}
export interface ICovalenthqParam {}

export interface ICovalenthqParamForHistoricalTransaction extends ICovalenthqParam { 
  address: string; 
}

export interface ICovalenthqResponseForHistoricalTransaction { 
  address: string; 
  updated_at: string; 
  next_update_at: string; 
  quote_currency: string; 
  chain_id: number; 
  items: {
    block_signed_at: string;
    block_height: number;
    tx_hash: string;
    tx_offset: number;
    successful: true,
    from_address: string;
    from_address_label?: string;
    to_address: string;
    to_address_label?: string;
    value: string;
    value_quote?: string;
    gas_offered: number;
    gas_spent: number;
    gas_price: number;
    fees_paid: string;
    gas_quote: null,
    gas_quote_rate: null,
    log_events: {
      block_signed_at: string;
      block_height: number;
      tx_offset: number;
      log_offset: number;
      tx_hash: string;
      raw_log_topics: string[];
      sender_contract_decimals: number;
      sender_name: string;
      sender_contract_ticker_symbol: string;
      sender_address: string;
      sender_address_label?: string;
      sender_logo_url: string;
      raw_log_data: string;
      decoded: {
        name: string;
        signature: string;
        params: {
            name: string;
            type: string;
            indexed: boolean;
            decoded: boolean;
            value: string;
          }[]
        }
      }[];
    }[];
    pagination: {
      has_more: boolean;
      page_number: number; 
      page_size: number; 
      total_count?: number; 
    }
}

export const getHistoricalTransactions = async (address: string, networkId: EVMNetwork, assetId: EVMAssetId, fromBlock?: BigNumber)
: Promise<IEVMHistoricalTransaction[]> => {
  try {
    const historicalTransactions: IEVMHistoricalTransaction[] = [];
    const MAX_QUERY_PAGE_NUMBER = 10;
    for (let pageNumber =0; pageNumber < MAX_QUERY_PAGE_NUMBER; pageNumber++) {
      const res = await superagent
        .get(`${getApiUrl(networkId, COVALENTHQ_API_TYPE.HISTORICAL_TRANSACTIONS, {address})}&page-number=${pageNumber}`)
        .set("accept", "json");
      const data: ICovalenthqResponseForHistoricalTransaction = res?.body?.data;
      for (const item of data.items) {
        let toAddress: string = item.to_address;
        if (assets[assetId].assetType === EVMAssetType.ERC20) {
          for (const event of item.log_events) { 
            if (event.decoded.signature != "Transfer(indexed address from, indexed address to, uint256 value)") continue;
            for (const param of event.decoded.params) { 
              if (param.name === "to") toAddress = param.value;
            }
          }
        }
        const historicalTransaction: IEVMHistoricalTransaction = {
          assetId,
          amount: new BigNumber(item.value),
          from: item.from_address,
          fee: new BigNumber(item.gas_price).multipliedBy(item.gas_spent),
          to: toAddress,
          nonce: new BigNumber(0),
          blockNumber: new BigNumber(item.block_height),
          transactionHash: item.tx_hash,
          timestamp: Date.parse(item.block_signed_at),
        };
        historicalTransactions.push(historicalTransaction);
      }
      if (!data.pagination.has_more) {
        break;
      }
    }
    console.log(historicalTransactions);
    return historicalTransactions;
  } catch(err) {
    console.log("Failed to getHistoricalTransactionsByCovalenthq", err);
    throw err;
  }
};

const getApiUrl = (networkId: EVMNetwork, apiType: COVALENTHQ_API_TYPE, param: ICovalenthqParam ) : string => {
  // TODO move to process.env
  const url = "https://api.covalenthq.com/v1";
  const endPoint = apiType.toString().replace(":chain_id", `${networks[networkId].chainId}`);
  const API_KEY = process.env.REACT_APP_COVALENTHQ_KEY;
  switch (apiType) {
    case COVALENTHQ_API_TYPE.HISTORICAL_TRANSACTIONS:
    {
      param = param as ICovalenthqParamForHistoricalTransaction;
      return `${url}/${getApiEndPoint(networkId, apiType, param)}/?key=${API_KEY}`;
    }
    default:
      throw new Error("Non Supported Network");
  }
};

const getApiEndPoint = (networkId: EVMNetwork, apiType: COVALENTHQ_API_TYPE, param: ICovalenthqParam ) : string => {
  const endPoint = apiType.toString().replace(":chain_id", `${networks[networkId].chainId}`);
  switch (apiType) {
    case COVALENTHQ_API_TYPE.HISTORICAL_TRANSACTIONS:
    {
      const _param = param as ICovalenthqParamForHistoricalTransaction;
      return `${endPoint.replace(":address", _param.address)}`;
    }
    default:
      throw new Error("Non Supported Network");
  }
};
