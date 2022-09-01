import { EVMNetwork } from ".";
import { IEVMAsset, IEVMAssetERC20 } from "../interfaces";

export enum EVMAssetType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  // ERC721 = "ERC721",
  // ERC1155 = "ERC1155",
}

export const assets: {
  [network: string]: {
    [assetId: string]: IEVMAsset | IEVMAssetERC20;
  };
} = {
  [EVMNetwork.ETHEREUM]: {
    "ETH": {
      name: "Ethereum",
      symbol: "ETH",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
    },
    "USDC": {
      name: "USD Coin",
      symbol: "USDC",
      decimal: 6,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    "USDT": {
      name: "Tether USD",
      symbol: "USDT",
      decimal: 6,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
  },
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: {
    "ETH": {
      name: "Ethereum",
      symbol: "ETH",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
    },
    "TBC": { // TODO by Evelyn
      name: "TBC",
      symbol: "TBC",
      decimal: 18,
      assetType: EVMAssetType.ERC20,
      contractAddress: "TBC",
    },
  },
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: {
    "AVAX": {
      name: "Avalanche",
      symbol: "AVAX",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
    },
    "ALOT": {
      name: "Dexalot Token",
      symbol: "ALOT",
      decimal: 18,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0x9983F755Bbd60d1886CbfE103c98C272AA0F03d6",
    },
  },
};
