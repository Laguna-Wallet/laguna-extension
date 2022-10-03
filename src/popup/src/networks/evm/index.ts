import { IEVMAsset, IEVMAssetERC20, IEVMNetwork } from "../../utils/evm/interfaces";

export enum EVMNetwork {
  LOCALHOST = "LOCALHOST",
  ETHEREUM = "ETHEREUM", // mainnet
  ETHEREUM_TESTNET_GOERLI = "ETHEREUM_TESTNET_GOERLI", //testnet
  AVALANCHE_TESTNET_FUJI = "AVALANCHE_TESTNET_FUJI",
}

export const networks :{[network: string]: IEVMNetwork} = {
  [EVMNetwork.LOCALHOST]: {
    isTestnet: true,
    chainId: 1,
    nodeUrl: "http://127.0.0.1.8545",
    explorerUrlAddress: "https://etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.ETHEREUM]: {
    isTestnet: false,
    chainId: 1,
    nodeUrl: "https://cloudflare-eth.com",
    explorerUrlAddress: "https://etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: {
    isTestnet: true,
    chainId: 5,
    nodeUrl: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
    explorerUrlAddress: "https://goerli.etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://goerli.etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: {
    isTestnet: true,
    chainId: 43113,
    nodeUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    explorerUrlAddress: "https://testnet.snowtrace.io/address/{{hash}}",
    explorerUrlTransaction: "https://testnet.snowtrace.io/tx/{{hash}}",
  },
};

export enum EVMAssetType {
  NATIVE = "NATIVE",
  ERC20 = "ERC20",
  // ERC721 = "ERC721",
  // ERC1155 = "ERC1155",
}

export enum EVMAssetId {
  ETHEREUM_ETH = "ETHEREUM_ETH",
  ETHEREUM_USDC = "ETHEREUM_USDC",
  ETHEREUM_USDT = "ETHEREUM_USDT",
  ETHEREUM_TESTNET_GOERLI_ETH = "ETHEREUM_TESTNET_GOERLI_ETH",
  AVALANCHE_TESTNET_FUJI_AVAX = "AVALANCHE_TESTNET_FUJI_AVAX",
  AVALANCHE_TESTNET_FUJI_ALOT = "AVALANCHE_TESTNET_FUJI_ALOT",
}

export const assets: {
  [assetId: string]: IEVMAsset | IEVMAssetERC20;
} = {
  [EVMAssetId.ETHEREUM_ETH]: {
    name: "Ethereum",
    symbol: "ETH",
    decimal: 18,
    network: EVMNetwork.ETHEREUM,
    assetType: EVMAssetType.NATIVE,
  },
  [EVMAssetId.ETHEREUM_USDC]: {
    name: "USD Coin",
    symbol: "USDC",
    decimal: 6,
    network: EVMNetwork.ETHEREUM,
    assetType: EVMAssetType.ERC20,
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  [EVMAssetId.ETHEREUM_USDT]: {
    name: "Tether USD",
    symbol: "USDT",
    decimal: 6,
    network: EVMNetwork.ETHEREUM,
    assetType: EVMAssetType.ERC20,
    contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  [EVMAssetId.ETHEREUM_TESTNET_GOERLI_ETH]: {
    name: "Ethereum",
    symbol: "ETH",
    decimal: 18,
    network: EVMNetwork.ETHEREUM_TESTNET_GOERLI,
    assetType: EVMAssetType.NATIVE,
  },
  [EVMAssetId.AVALANCHE_TESTNET_FUJI_AVAX]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimal: 18,
    network: EVMNetwork.AVALANCHE_TESTNET_FUJI,
    assetType: EVMAssetType.NATIVE,
  },
  [EVMAssetId.AVALANCHE_TESTNET_FUJI_ALOT]: {
    name: "Dexalot Token",
    symbol: "ALOT",
    decimal: 18,
    network: EVMNetwork.AVALANCHE_TESTNET_FUJI,
    assetType: EVMAssetType.ERC20,
    contractAddress: "0x9983F755Bbd60d1886CbfE103c98C272AA0F03d6",
  },
};

export const nativeCurrencyByNetwork :{[network: string]: EVMAssetId} = {
  [EVMNetwork.LOCALHOST]: EVMAssetId.ETHEREUM_ETH,
  [EVMNetwork.ETHEREUM]: EVMAssetId.ETHEREUM_ETH,
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: EVMAssetId.ETHEREUM_TESTNET_GOERLI_ETH,
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: EVMAssetId.AVALANCHE_TESTNET_FUJI_AVAX,
};

export const assetByNetwork: {
  [network: string]: {
    [assetId: string]: IEVMAsset | IEVMAssetERC20;
  };
} = {
  [EVMNetwork.ETHEREUM]: {
    [EVMAssetId.ETHEREUM_ETH]: assets[EVMAssetId.ETHEREUM_ETH],
    [EVMAssetId.ETHEREUM_USDC]: assets[EVMAssetId.ETHEREUM_USDC],
    [EVMAssetId.ETHEREUM_USDT]: assets[EVMAssetId.ETHEREUM_USDT],
  },
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: {
    [EVMAssetId.ETHEREUM_TESTNET_GOERLI_ETH]: assets[EVMAssetId.ETHEREUM_TESTNET_GOERLI_ETH],
  },
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: {
    [EVMAssetId.AVALANCHE_TESTNET_FUJI_AVAX]: assets[EVMAssetId.AVALANCHE_TESTNET_FUJI_AVAX],
    [EVMAssetId.AVALANCHE_TESTNET_FUJI_ALOT]: assets[EVMAssetId.AVALANCHE_TESTNET_FUJI_ALOT],
  },
};
