export enum Network {
  ETHEREUM,
}
// FIXME move to env
export const NodeUrl = {
  [Network.ETHEREUM]: "https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_"
}

export const ExplorerURLAddress = {
  [Network.ETHEREUM]: "https://etherscan.io/address/{{address}}"
}

export const ExplorerURLTransaction = {
  [Network.ETHEREUM]: "https://etherscan.io/tx/{{hash}}"
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
  }
}
