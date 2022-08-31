import { IEVMNetwork } from "../interfaces";

export enum EVMNetwork {
  LOCALHOST = "LOCALHOST",
  ETHEREUM = "ETHEREUM", // mainnet
  ETHEREUM_TESTNET_GOERLI = "ETHEREUM_TESTNET_GOERLI", //testnet
  AVALANCHE_TESTNET_FUJI = "AVALANCHE_TESTNET_FUJI",
}

export const networks :{[network: string]: IEVMNetwork} = {
  [EVMNetwork.LOCALHOST]: {
    chainId: 1,
    nodeUrl: "http://127.0.0.1.8545",
    explorerUrlAddress: "https://etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.ETHEREUM]: {
    chainId: 1,
    nodeUrl: "https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
    explorerUrlAddress: "https://etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.ETHEREUM_TESTNET_GOERLI]: {
    chainId: 5,
    nodeUrl: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
    explorerUrlAddress: "https://goerli.etherscan.io/address/{{hash}}",
    explorerUrlTransaction: "https://goerli.etherscan.io/tx/{{hash}}",
  },
  [EVMNetwork.AVALANCHE_TESTNET_FUJI]: {
    chainId: 43113,
    nodeUrl: "https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_",
    explorerUrlAddress: "https://testnet.snowtrace.io/address/{{hash}}",
    explorerUrlTransaction: "https://testnet.snowtrace.io/tx/{{hash}}",
  },
};
