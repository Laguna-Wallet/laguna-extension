import { EVMNetwork } from "networks/evm";
import { Asset, TokenSymbols } from "./types";

// Todo Refactor
export const emptyAssets: Asset[] = [
  { name: "polkadot", calculatedPrice: 0, chain: "polkadot", symbol: "dot" },
  { name: "kusama", calculatedPrice: 0, chain: "kusama", symbol: "ksm" },
  {
    name: "ethereum",
    calculatedPrice: 0,
    chain: EVMNetwork.ETHEREUM,
    symbol: TokenSymbols.ethereum,
  },
  { name: "USD Coin", calculatedPrice: 0, chain: EVMNetwork.ETHEREUM, symbol: TokenSymbols.USDC },
  { name: "Tether USD", calculatedPrice: 0, chain: EVMNetwork.ETHEREUM, symbol: TokenSymbols.USDT },
];

//   name: "USD Coin",
//   symbol: TokenSymbols.USDC,
//   chain: EVMNetwork.ETHEREUM,
//   decimal: 6,
//   assetType: EVMAssetType.ERC20,
//   contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
// },
// {
//   name: "Tether USD",
//   symbol: TokenSymbols.USDT,
//   chain: EVMNetwork.ETHEREUM,
//   decimal: 6,
//   assetType: EVMAssetType.ERC20,
//   contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
// },
// {

// USDC
// USDT
// wBTC
