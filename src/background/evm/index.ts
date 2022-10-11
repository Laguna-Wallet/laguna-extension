import { Transaction, TxData } from "@ethereumjs/tx"
import { ethers } from "ethers"
import { EVMNetwork, networks } from "../../popup/src/networks/evm"
import { IEVMToBeSignTransaction } from "../../popup/src/utils/evm/interfaces"

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
}

export const signTransaction = async (keyPair: any, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  const privateKey = Buffer.from(keyPair.privateKey.substring(2, 66), "hex")

  const tx: Transaction = Transaction.fromTxData({
      nonce: toBeSignTransaction.nonce,
      gasPrice: toBeSignTransaction.gasPrice,
      gasLimit: toBeSignTransaction.gasLimit,
      to: toBeSignTransaction.to,
      data: toBeSignTransaction.data? toBeSignTransaction.data.toString(): "",
      value: toBeSignTransaction.value,
      chainId: toBeSignTransaction.chainId.toString() ,
  } as TxData);
  const signedTransaction = tx.sign(privateKey);
  return `0x${signedTransaction.serialize().toString("hex")}`;
}

export const broadcastTransaction = async (network: EVMNetwork, signedTx: string): Promise<string> => {
  const provider = getProvider(network)
  console.log(1)
  const transactionReceipt = await provider.sendTransaction(`0x${signedTx}`)
  console.log(2)
  return transactionReceipt.hash
}
