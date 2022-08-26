import { ethers } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction } from "./interfaces"
import fs from "fs";
import BigNumber from "bignumber.js";
import { EVMNetwork, networks } from "./networks";
import { EVMAssetType } from "./networks/asset";

// // ?? remove ?
// export const generateNewWalletAddress = (address: string): ethers.Wallet | string => {   
//     const pair = keyring.getPair(address) 
//     const wallet = ethers.Wallet.fromMnemonic(pair?.meta?.encodedSeed as string)
//     return wallet;
// }

// // ?? remove ?
// export const importWalletAddress = async (JSON: any, password: string) => {
//     const wallet = await ethers.Wallet.fromEncryptedJsonSync( JSON , password )
//     return wallet
// }

export const getCheckSumAddress = (address: string): string => {
  const checksumAddress = ethers.utils.getAddress(address) // util returns checksum address
  return checksumAddress
}

export const isValidEVMAddress = (address: string): boolean => {
  if(!address.startsWith('0x')) {
    return false
  }

  const isAddressValid  = ethers.utils.isAddress(address) 
  return isAddressValid
}

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
}

export const getNonce = async (network: EVMNetwork, address: string): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
  const nonce = await provider.getTransactionCount(address, "latest");
  return new BigNumber(nonce);
}

export const getGasPrice = async (network: EVMNetwork): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
  const gasPrice = await provider.getGasPrice();
  return new BigNumber(gasPrice.toString());
}

export const estimateGas = async (network: EVMNetwork, toBeSignTransaction: IEVMToBeSignTransaction): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
  const estimateResult = await provider.estimateGas(toBeSignTransaction);
  return new BigNumber(estimateResult.toString())
}

export const buildTransaction = async (
  param: IEVMBuildTransaction
  ): Promise<IEVMToBeSignTransaction> => {
    const onChainNonce = await getNonce(param.network, param.fromAddress);
    const toBeSignTransaction = {
        to: param.toAddress,
        from: param.fromAddress,
        value: param.amount.multipliedBy(`1E${param.asset.decimal}`).toString(10),
        gasPrice: param.gasPriceInGwei.toString(10),
        gasLimit: ethers.utils.hexlify(100000),
        nonce: onChainNonce.toString(10), // TODO plus numOfPendingTransaction or using ethers.NonceManager
    }
    return toBeSignTransaction
}

export const broadcastTransaction = async (network: EVMNetwork, signedTx: string): Promise<string> => {   
    // const signedTx = "0xf8690401825208945555763613a12d8f3e73be831dff8598089d3dca882b992b75cbeb600080820a95a01727bd07080a5d3586422edad86805918e9772adda231d51c32870a1f1cabffba07afc6be528befb79b9ed250356f6eacd63e853685091e9a3987a3d266c6cb26a";
    const provider = getProvider(network);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    return transactionReceipt.hash;
  }

export const getBalance = async (network: EVMNetwork, address: string, asset: IEVMAsset | IEVMAssetERC20): Promise<BigNumber> => {
  const provider = getProvider(network);
  let balanceInBaseUnit;
  switch (asset.assetType) {
    case EVMAssetType.NATIVE: {
      balanceInBaseUnit = await provider.getBalance(address)
      break;
    }
    case EVMAssetType.ERC20: {
      const abiFileName = "ERC20";
      const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
      const contract = new ethers.Contract((asset as IEVMAssetERC20).contractAddress, ERC20ABI, provider)
      balanceInBaseUnit = await contract.balanceOf(address)
      break;
    }
  }
  return new BigNumber(balanceInBaseUnit).dividedBy(`1E${asset.decimal}`);
}
