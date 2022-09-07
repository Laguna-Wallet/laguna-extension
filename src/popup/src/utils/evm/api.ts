import { ethers } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response } from "./interfaces";
import fs from "fs";
import BigNumber from "bignumber.js";
import { EVMNetwork, networks } from "./networks";
import { EVMAssetType } from "./networks/asset";
import  axios  from "axios";

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

export const toCheckSumAddress = (address: string): string => {
  const checksumAddress = ethers.utils.getAddress(address); 
  return checksumAddress;
};

export const isValidEVMAddress = (address: string): Response => {

  try {
    if(!address.startsWith("0x")) throw "EVM address should start with 0x";

    if(address.length < 42) throw "invalid address length";
    
    if(!ethers.utils.isAddress(address)) throw "invalid EVM address";

  } catch(err) {
      return {
        success: false,
        message: `${err}`,
      };
  }
  return {
    success: true,
    message: "Valid EVM address",
  };
};


export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
};

export const getNonce = async (network: EVMNetwork, address: string): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const nonce = await provider.getTransactionCount(address, "latest");
  return new BigNumber(nonce);
};

export const getGasPrice = async (network: EVMNetwork): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const gasPrice = await provider.getGasPrice();
  return new BigNumber(gasPrice.toString());
};

export const estimateGas = async (network: EVMNetwork, toBeSignTransaction: IEVMToBeSignTransaction): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const estimateResult = await provider.estimateGas(toBeSignTransaction);
  return new BigNumber(estimateResult.toString());
};

export const isSmartContractAddress = async (network: EVMNetwork, address: string): Promise<boolean> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const code =  await provider.getCode(toCheckSumAddress(address));
  return (!code);
};

export const calculateTransactionFeeInNormalUnit = (toBeSignTransaction: IEVMToBeSignTransaction): BigNumber => {
  return new BigNumber(toBeSignTransaction.gasLimit).multipliedBy(toBeSignTransaction.gasPrice).dividedBy("1E18");
};

export const getEVMTransactions = (address: string, network: EVMNetwork) => {

  if(!isValidEVMAddress(address)) {
    return;
  }

  const options = {
    method: "POST",
    headers: {Accept: "application/json", "Content-Type": "application/json"},
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          category: ["erc20"],
          withMetadata: false,
          excludeZeroValue: true,
          maxCount: "0x3e8",
          fromAddress: address,
        },
      ],
    }),
  };
  
 const transactions = fetch(networks[network].nodeUrl, options)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      return Promise.reject(response); })

    .catch(err => console.error(err));

  return transactions;
};

export const buildTransaction = async (  param: IEVMBuildTransaction  ): Promise<IEVMToBeSignTransaction> => {
  const onChainNonce = await getNonce(param.network, param.fromAddress);

  const toBeSignTransaction: IEVMToBeSignTransaction = {
    to: param.toAddress,
    from: param.fromAddress,
    value: `0x${param.amount.multipliedBy(`1E${param.asset.decimal}`).toString(16)}`,
    gasPrice: param.gasPriceInGwei.toString(10),
    gasLimit: new BigNumber(21000).toString(10),
    nonce: onChainNonce.toString(10), // TODO plus numOfPendingTransaction or using ethers.NonceManager
    chainId: networks[param.network].chainId,
  };
  toBeSignTransaction.gasLimit = ( await estimateGas(param.network, toBeSignTransaction)).toString(10);
  return toBeSignTransaction;
};

export const signTransaction = async (network: EVMNetwork, wallet: ethers.Wallet, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
  // TODO decide were wallet is generated from
  const provider = getProvider(network);
  const signer = wallet.connect(provider);
  const signedTx = signer.signTransaction(toBeSignTransaction);
 return signedTx;
};

export const broadcastTransaction = async (network: EVMNetwork, signedTx: string): Promise<string> => {   
    // const signedTx = "0xf8690401825208945555763613a12d8f3e73be831dff8598089d3dca882b992b75cbeb600080820a95a01727bd07080a5d3586422edad86805918e9772adda231d51c32870a1f1cabffba07afc6be528befb79b9ed250356f6eacd63e853685091e9a3987a3d266c6cb26a";
    const provider = getProvider(network);
    const transactionReceipt = await provider.sendTransaction(signedTx);
    return transactionReceipt.hash;
  };

export const getBalance = async (network: EVMNetwork, address: string, asset: IEVMAsset | IEVMAssetERC20): Promise<BigNumber> => {
  const provider = getProvider(network);
  let balanceInBaseUnit;
  switch (asset.assetType) {
    case EVMAssetType.NATIVE: {
      balanceInBaseUnit = await provider.getBalance(address);
      break;
    }
    case EVMAssetType.ERC20: {
      const abiFileName = "ERC20";
      const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
      const contract = new ethers.Contract((asset as IEVMAssetERC20).contractAddress, ERC20ABI, provider);
      balanceInBaseUnit = await contract.balanceOf(address);
      break;
    }
  }
  return new BigNumber(balanceInBaseUnit).dividedBy(`1E${asset.decimal}`);
};
