import { ethers } from "ethers";
import {
  IEVMAssetERC20,
  IEVMAsset,
  IEVMBuildTransaction,
  IEVMToBeSignTransaction,
  Response,
  IEVMBuildTransactionOnChainParam,
  IEVMNetwork,
  Transfer,
  TransactionState,
  TransfersList,
} from "./interfaces";
// import fs from 'fs';
import BigNumber from "bignumber.js";
import { EVMNetwork, networks } from "networks/evm";
import { EVMAssetType, EvmAssets } from "networks/evm/asset";
import ERC20ABI from "./abi/ERC20.json";

export const generateNewWalletAddress = (mnemonicSeed: string): string => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicSeed as string);
  return wallet.address;
};

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
    if (!address.startsWith("0x")) throw "EVM address should start with 0x";
    if (address.length != 42) throw "invalid address length";
    if (!ethers.utils.isAddress(address)) throw "invalid EVM address";
  } catch (err) {
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
  // return new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545");
  return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
};

export const getNetworkInfo = (network: EVMNetwork): IEVMNetwork => {
  return networks[network];
};

export const getAssetInfo = (network: EVMNetwork, assetId: string): IEVMAsset | IEVMAssetERC20 => {
  const asset = EvmAssets[network][assetId];
  if (!asset) {
    throw new Error("Invalid Asset Id");
  }
  return asset;
};

export const getNonce = async (network: EVMNetwork, address: string): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const nonce = await provider.getTransactionCount(address, "latest");
  return new BigNumber(nonce);
};

export const getEvmGasPrice = async (network: EVMNetwork): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const gasPrice = await provider.getGasPrice();
  return new BigNumber(gasPrice.toString());
};

export const estimateGas = async (
  network: EVMNetwork,
  toBeSignTransaction: IEVMToBeSignTransaction,
): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  if (await isSmartContractAddress(network, toBeSignTransaction.to)) {
    const estimateResult = await provider.estimateGas(toBeSignTransaction);
    return new BigNumber(estimateResult.toString()).multipliedBy(1.5);
  } else {
    return new BigNumber(21000);
  }
};

export const getEVMTransactions = async (
  address: string,
  network: EVMNetwork,
  key?: string,
  transfers?: Transfer[],
): Promise<TransactionState> => {
  const options = {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          category: ["internal", "erc20", "external"],
          withMetadata: false,
          excludeZeroValue: false,
          fromAddress: address,
          ...(key && { pageKey: key }),
        },
      ],
    }),
  };

  try {
    console.log("~ address", address);
    console.log("~ network", network);
    const res = await fetch(networks[network].nodeUrl, options);
    const data: TransfersList = await res.json();
    console.log("~ data", data);
    const transfer: Transfer[] = transfers || [];
    transfer.push(...data.result.transfers);
    if (data.result.pageKey) {
      getEVMTransactions(address, network, data.result.pageKey, transfer);
    }
    return {
      success: true,
      transfers: transfer,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      transfers: null,
    };
  }
};

export const getBuildTransactionOnChainParam = async (
  network: EVMNetwork,
  fromAddress: string,
  assetId: string,
): Promise<IEVMBuildTransactionOnChainParam> => {
  const networkInfo = networks[network];
  const [nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance] = await Promise.all([
    await getNonce(network, fromAddress),
    await getEvmGasPrice(network),
    await getEVMBalance(network, fromAddress, getAssetInfo(network, networkInfo.nativeCurreny)),
    await getEVMBalance(network, fromAddress, getAssetInfo(network, assetId)),
  ]);
  return {
    nonce,
    gasPriceInGwei,
    nativeCurrenyBalance,
    assetBalance,
  };
};

export const buildTransaction = async (
  param: IEVMBuildTransaction,
): Promise<IEVMToBeSignTransaction> => {
  const { network, asset, amount, fromAddress, toAddress, nonce, gasPriceInGwei, gasLimit } = param;

  if (asset.assetType === EVMAssetType.NATIVE) {
    const toBeSignTransaction: IEVMToBeSignTransaction = {
      to: toAddress,
      from: fromAddress,
      value: `0x${amount.multipliedBy(`1E${asset.decimal}`).toString(16)}`,
      gasPrice: gasPriceInGwei.multipliedBy("1E9").toString(10),
      gasLimit: gasPriceInGwei.toString(10),
      nonce: nonce.toString(10),
      chainId: networks[network].chainId,
    };
    return toBeSignTransaction;
  } else if (asset.assetType === EVMAssetType.ERC20) {
    const contract = initERC20SmartContract(network, asset as IEVMAssetERC20);
    return {
      gasPrice: gasPriceInGwei.multipliedBy("1E9").toString(10),
      gasLimit: gasPriceInGwei.toString(10),
      nonce: nonce.toString(10),
      chainId: networks[network].chainId,
      from: fromAddress,
      to: toCheckSumAddress(asset.contractAddress),
      value: "0",
      data: contract.methods
        .transfer(
          toCheckSumAddress(toAddress),
          amount.multipliedBy(`1E${asset.decimal}`).toString(10),
        )
        .encodeABI(),
    } as IEVMToBeSignTransaction;
  }
  throw new Error("invalid assetType");
};

export const signTransaction = async (
  network: EVMNetwork,
  wallet: ethers.Wallet,
  toBeSignTransaction: IEVMToBeSignTransaction,
): Promise<string> => {
  // TODO decide were wallet is generated from
  const provider = getProvider(network);
  const signer = wallet.connect(provider);
  const signedTx = signer.signTransaction(toBeSignTransaction);
  return signedTx;
};

export const broadcastTransaction = async (
  network: EVMNetwork,
  signedTx: string,
): Promise<string> => {
  const provider = getProvider(network);
  const transactionReceipt = await provider.sendTransaction(signedTx);
  return transactionReceipt.hash;
};

export const getEVMBalance = async (
  network: EVMNetwork,
  address: string,
  asset: IEVMAsset | IEVMAssetERC20,
): Promise<BigNumber> => {
  const provider = getProvider(network);
  let balanceInBaseUnit;
  switch (asset.assetType) {
    case EVMAssetType.NATIVE: {
      balanceInBaseUnit = await provider.getBalance(address);
      break;
    }
    case EVMAssetType.ERC20: {
      const contract = initERC20SmartContract(network, asset as IEVMAssetERC20);
      balanceInBaseUnit = await contract.balanceOf(address);
      break;
    }
  }
  return new BigNumber(balanceInBaseUnit).dividedBy(`1E${asset.decimal}`);
};

const initERC20SmartContract = (network: EVMNetwork, asset: IEVMAssetERC20): ethers.Contract => {
  const provider = getProvider(network);
  const abiFileName = "ERC20";
  // const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
  return new ethers.Contract((asset as IEVMAssetERC20).contractAddress, ERC20ABI, provider);
};
