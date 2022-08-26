import { ethers } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMSignedTransaction } from "./interfaces"
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

export const getFeeData = async (network: EVMNetwork, contractAddress: string, ReceiverAddress: string, amount: string) => {
    const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
    const abiFileName = "ERC20";
    const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
    const estimationData = await contract.estimateGas.transfer(ReceiverAddress, amount)
    return estimationData
}

export const buildTransaction = async (
  param: IEVMBuildTransaction
  ) => {
    const onChainNonce = await getNonce(param.network, param.fromAddress);
    const toBeSignTransaction = {
        to: param.toAddress,
        from: param.fromAddress,
        value: param.amount.multipliedBy(`1E${param.asset.decimal}`),
        gasPrice: param.gasPriceInGwei,
        gasLimit: ethers.utils.hexlify(100000),
        nonce: onChainNonce, // TODO plus numOfPendingTransaction
    }
    return toBeSignTransaction
}

export const broadcastTransaction = async (network: EVMNetwork, transaction: IEVMSignedTransaction): Promise<string> => {   
  
    // const account = await getFromStorage(StorageKeys.ActiveAccount);
  
    // if(account == null) {
    //   return "could not find valid account"
    // }
  
    // const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl)
    // const address = JSON.parse(account as string).address;
    // const abiFileName = "ERC20";
    // const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
    // const wallet = await getWalletAddress(password, address)
  
    // const gasPrice = provider.getGasPrice()
    // const signer = wallet.connect(provider)
  
    // if(contractAddress == null) {
    //   const tx = buildEthereumTransaction(receiverAddress, amount, gasPrice, wallet.address )
    //   const transaction = await signer.sendTransaction(tx)
    //   return transaction.hash;
  
    // } else if (contractAddress) {
    //   getFeeData(contractAddress, receiverAddress, amount)
    //   const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
    //   const tokenSigner = contract.connect(signer)
    //   const transaction =  await tokenSigner.transfer(receiverAddress, amount)
    //   return transaction.hash;
    // }
  
    // return "invalid contract type"
  }

export const getBalance = async (network: EVMNetwork, address: string, asset: IEVMAsset | IEVMAssetERC20): BigNumber => {
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
