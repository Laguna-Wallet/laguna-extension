import { EVMAssetId, EVMNetwork } from ".";
import { IEVMAsset, IEVMAssetERC20 } from "../../utils/evm/interfaces";

export enum EVMAssetType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  // ERC721 = "ERC721",
  // ERC1155 = "ERC1155",
}

export const EvmAssets: {
  [network: string]: {
    [assetId: string]: IEVMAsset | IEVMAssetERC20;
  };
} = {
  [EVMNetwork.ETHEREUM]: {
    ETH: {
      name: "Ethereum",
      symbol: "ETH",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
      assetId: EVMAssetId.ETHEREUM_ETH,
    },
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimal: 6,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      assetId: EVMAssetId.ETHEREUM_USDC,
    },
    USDT: {
      name: "Tether USD",
      symbol: "USDT",
      decimal: 6,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      assetId: EVMAssetId.ETHEREUM_USDT,
    },
  },
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: {
    ETH: {
      name: "Ethereum",
      symbol: "ETH",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
      assetId: EVMAssetId.ETHEREUM_TESTNET_GOERLI_ETH,
    },
  },
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: {
    AVAX: {
      name: "Avalanche",
      symbol: "AVAX",
      decimal: 18,
      assetType: EVMAssetType.NATIVE,
      assetId: EVMAssetId.AVALANCHE_TESTNET_FUJI_AVAX,
    },
    ALOT: {
      name: "Dexalot Token",
      symbol: "ALOT",
      decimal: 18,
      assetType: EVMAssetType.ERC20,
      contractAddress: "0x9983F755Bbd60d1886CbfE103c98C272AA0F03d6",
      assetId: EVMAssetId.AVALANCHE_TESTNET_FUJI_ALOT,
    },
  },
};
