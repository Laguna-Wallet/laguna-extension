import { Transaction, TxData } from "@ethereumjs/tx"
import { IEVMToBeSignTransaction } from "../../popup/src/utils/evm/interfaces"

export const signTransaction = async (keyPair: any, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  // const privateKey = Buffer.from(keyPair.privateKey, "hex")
  console.log("~ keyPair.privateKey", keyPair)
  const privateKey = Buffer.from(keyPair.privateKey.substring(2, 66), "hex")

  const tx: Transaction = Transaction.fromTxData({
    nonce: toBeSignTransaction.nonce,
    gasPrice: toBeSignTransaction.gasPrice,
    gasLimit: toBeSignTransaction.gasLimit,
    to: toBeSignTransaction.to,
    data: toBeSignTransaction?.data ? toBeSignTransaction?.data?.toString() : "",
    value: toBeSignTransaction.value,
    chainId: toBeSignTransaction?.chainId ? toBeSignTransaction?.chainId.toString() : "",
  } as TxData)

  const signedTransaction = tx.sign(privateKey)
  return signedTransaction.serialize().toString("hex")
}
