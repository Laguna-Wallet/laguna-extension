import { ethers } from "ethers"
import { EVMNetwork, networks } from "../../popup/src/networks/evm"
import { IEVMToBeSignTransaction } from "../../popup/src/utils/evm/interfaces"

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
}

export const generateNewEvmWallet = (mnemonicSeed: string): ethers.Wallet => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicSeed as string)
  return wallet
}

export const signTransaction = async (wallet: ethers.Wallet, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  return await wallet.signTransaction(toBeSignTransaction)
}

export const broadcastTransaction = async (network: EVMNetwork, signedTransaction: string): Promise<string> => {
  const provider = getProvider(network)
  const transactionReceipt = await provider.sendTransaction(signedTransaction)
  return transactionReceipt.hash
}
