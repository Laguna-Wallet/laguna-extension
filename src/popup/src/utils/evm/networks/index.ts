export enum Network {
  ETHEREUM,
  ETHEREUM_TESTNET_GOERLI,
  AVALANCHE_TESTNET_FUJI,
}

export const ChainId = {
  [Network.ETHEREUM]: 1,
  [Network.ETHEREUM_TESTNET_GOERLI]: 5,
  [Network.AVALANCHE_TESTNET_FUJI]: 43113
}

// FIXME move to env
export const NodeUrl = {
  [Network.ETHEREUM]: "https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_"
}

export const ExplorerURLAddress = {
  [Network.ETHEREUM]: "https://etherscan.io/address/{{address}}",
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://goerli.etherscan.io/address/{{address}}",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://testnet.snowtrace.io/address/{{address}}"
}

export const ExplorerURLTransaction = {
  [Network.ETHEREUM]: "https://etherscan.io/tx/{{hash}}",
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://goerli.etherscan.io/tx/{{hash}}",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://testnet.snowtrace.io/tx/{{hash}}"
}

export const ERC20ContractAddress: any = {
  [Network.ETHEREUM]: {
    "USDC": {
      name: "USD Coin",
      symbol: "USDC",
      decimal: 6,
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    "USDT": {
      name: "Tether USD",
      symbol: "USDT",
      decimal: 6,
      contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
  },
  [Network.ETHEREUM_TESTNET_GOERLI]: {
    "TBC": {
      name: "TBC",
      symbol: "TBC",
      decimal: 18,
      contractAddress: "TBC"
    },
  },
  [Network.AVALANCHE_TESTNET_FUJI]: {
    "WAVAX": {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimal: 18,
      contractAddress: "TBC"
    },
    "ALOT": {
      name: "Dexalot Token",
      symbol: "ALOT",
      decimal: 18,
      contractAddress: "0x9983F755Bbd60d1886CbfE103c98C272AA0F03d6"
    },
    "TEST_USD": {
      name: "Test USD",
      symbol: "TEST_USD",
      decimal: 6,
      contractAddress: "TBC"
    }
  }
}
