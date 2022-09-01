import { ethers } from "ethers"
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response } from "../../../popup/src/utils/evm/interfaces"
import { EVMAssetType } from "../../../popup/src/utils/evm/networks/asset"
import { EVMNetwork, networks } from "../../../popup/src/utils/evm/networks"

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  // return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
  return new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545")
}

export const generateNewEvmWallet = (mnemonicSeed: string): ethers.Wallet => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicSeed as string)
  return wallet
}

export const signTransaction = async (network: EVMNetwork, wallet: ethers.Wallet, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  const provider = getProvider(network)
  // const signer = wallet.connect(provider)
  console.log(1)
  console.log("~ toBeSignTransaction", toBeSignTransaction)
  const signedTx = await wallet.signTransaction(toBeSignTransaction)
  console.log(2)
  return signedTx
}
