import { ethers } from "ethers"
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response } from "../../../popup/src/utils/evm/interfaces"
import { EVMAssetType } from "../../../popup/src/networks/evm/asset"
import { EVMNetwork, networks } from "../../../popup/src/networks/evm"

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
  // return new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545")
}

export const generateNewEvmWallet = (mnemonicSeed: string): ethers.Wallet => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicSeed as string)
  return wallet
}

export const signTransaction = async (network: EVMNetwork, wallet: ethers.Wallet, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  const provider = getProvider(network)
  // const signer = wallet.connect(provider)
  const signedTx = await wallet.signTransaction(toBeSignTransaction)
  return signedTx
}