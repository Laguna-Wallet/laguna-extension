export enum Network {
  ETHEREUM_TESTNET_GOERLI,
  AVALANCHE_TESTNET_FUJI,
}

// FIXME move to env
export const NodeUrl = {
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_"
}

export const ExplorerURLAddress = {
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://goerli.etherscan.io/address/{{address}}",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://testnet.snowtrace.io/address/{{address}}"
}

export const ExplorerURLTransaction = {
  [Network.ETHEREUM_TESTNET_GOERLI]: "https://goerli.etherscan.io/tx/{{hash}}",
  [Network.AVALANCHE_TESTNET_FUJI]: "https://testnet.snowtrace.io/tx/{{hash}}"
}


export const ERC20ContractAddress: any = {
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
