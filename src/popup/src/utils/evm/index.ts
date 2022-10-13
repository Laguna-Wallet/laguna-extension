import { ethers } from "ethers";
import fs from "fs";
import BigNumber from "bignumber.js";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response, IEVMBuildTransactionOnChainParam, IEVMNetwork, IEVMHistoricalTransaction } from "./interfaces";
import { EVMNetwork, nativeCurrencyByNetwork, networks, assetByNetwork, EVMAssetId, EVMAssetType } from "networks/evm";
import * as alchemyApi from "./api/alchemy";
import * as covalenthqApi from "./api/covalenthq";

export const generateNewWalletAddress = (mnemonicSeed: string): string => {
  const wallet = ethers.Wallet.fromMnemonic(mnemonicSeed as string);
  return wallet.address;
};

export const toCheckSumAddress = (address: string): string => {
  const checksumAddress = ethers.utils.getAddress(address);
  return checksumAddress;
};

export const isValidAddress = (address: string): Response => {
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

export const getAssetInfo = (
  network: EVMNetwork,
  assetId: EVMAssetId,
): IEVMAsset | IEVMAssetERC20 => {
  const asset = assetByNetwork[network][assetId];
  if (!asset) {
    throw new Error("Invalid Asset Id");
  }
  return asset;
};

export const getNonce = async (network: EVMNetwork, address: string): Promise<BigNumber> => {
  const provider = getProvider(network);
  const nonce = await provider.getTransactionCount(address, "latest");
  return new BigNumber(nonce);
};

export const getGasPrice = async (network: EVMNetwork): Promise<BigNumber> => {
  const provider = getProvider(network);
  const gasPrice = await provider.getGasPrice();
  return new BigNumber(gasPrice.toString());
};

export const estimateGasLimit = async (network: EVMNetwork, param: IEVMBuildTransaction): Promise<BigNumber> => {
  const provider = getProvider(network);
  const transaction = buildTransaction(param);
  if (await isSmartContractAddress(network, param.toAddress)) {
    const estimateResult = await provider.estimateGas(transaction);
    return new BigNumber(estimateResult.toString()).multipliedBy(1.5);
  } else {
    return new BigNumber(21000);
  }
};

export const isSmartContractAddress = async (
  network: EVMNetwork,
  address: string,
): Promise<boolean> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const code = await provider.getCode(toCheckSumAddress(address));
  return !code;
};

export const calculateTransactionFeeInNormalUnit = (
  toBeSignTransaction: IEVMToBeSignTransaction,
): BigNumber => {
  return new BigNumber(toBeSignTransaction.gasLimit)
    .multipliedBy(toBeSignTransaction.gasPrice)
    .dividedBy("1E18");
};

export const getBuildTransactionOnChainParam = async (
  networkId: EVMNetwork,
  fromAddress: string,
  assetId: EVMAssetId,
): Promise<IEVMBuildTransactionOnChainParam> => {
  const [nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance] = await Promise.all([
    await getNonce(networkId, fromAddress),
    await getGasPrice(networkId),
    await getBalance(
      networkId,
      fromAddress,
      getAssetInfo(networkId, nativeCurrencyByNetwork[networkId]),
    ),
    await getBalance(networkId, fromAddress, getAssetInfo(networkId, assetId)),
  ]);
  return {
    nonce,
    gasPriceInGwei,
    nativeCurrenyBalance,
    assetBalance,
  };
};

export const buildTransaction = (  param: IEVMBuildTransaction  )
: IEVMToBeSignTransaction => {
  const {network, asset, amount, fromAddress, toAddress, nonce,gasPriceInGwei, gasLimit} = param;

  if (asset.assetType === EVMAssetType.NATIVE) {
    const toBeSignTransaction: IEVMToBeSignTransaction = {
      to: toAddress,
      from: fromAddress,
      value: `0x${amount.multipliedBy(`1E${asset.decimal}`).toString(16)}`,
      gasPrice: `0x${gasPriceInGwei.multipliedBy("1E9").toString(16)}`,
      gasLimit: gasLimit ? `0x${gasLimit.toString(16)}` : "",
      nonce: `0x${nonce.toString(16)}`,
      chainId: networks[network].chainId,
    };

    return toBeSignTransaction;
  } else if (asset.assetType === EVMAssetType.ERC20) {
    const contract = initERC20SmartContract(network, asset as IEVMAssetERC20);
    return {
      gasPrice: `0x${gasPriceInGwei.multipliedBy("1E9").toString(16)}`,
      gasLimit: gasLimit ? `0x${gasLimit.toString(16)}` : "",
      nonce: `0x${nonce.toString(16)}`,
      chainId: networks[network].chainId,
      from: fromAddress,
      to: toCheckSumAddress(asset?.contractAddress),
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

export const signEVMTransaction = async (
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

export const getBalance = async (
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

  return balanceInBaseUnit.toString();
  // return new BigNumber(balanceInBaseUnit).dividedBy(`1E${asset.decimal}`);
};

const initERC20SmartContract = (network: EVMNetwork, asset: IEVMAssetERC20): ethers.Contract => {
  const provider = getProvider(network);
  const abiFileName = "ERC20";
  const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
  return new ethers.Contract((asset as IEVMAssetERC20).contractAddress, ERC20ABI, provider);
};

export const getAssetIdBySmartContractAddress = (
  smartContractAddress: string,
  network: EVMNetwork,
): string | null => {
  const contractObject = Object.values(assetByNetwork[network]).find((object) => {
    const asset = object as IEVMAssetERC20;
    return toCheckSumAddress(asset.contractAddress) === toCheckSumAddress(smartContractAddress);
  });

  if (contractObject == null) {
    return null;
  }

  return contractObject.symbol;
};

export const getHistoricalTransactions = async (address: string, networkId: EVMNetwork, assetId: EVMAssetId)
: Promise<IEVMHistoricalTransaction[]> => {
  switch (networkId) {
    case EVMNetwork.LOCALHOST:
      return [];
    case EVMNetwork.ETHEREUM:
    case EVMNetwork.ETHEREUM_TESTNET_GOERLI:
      return await alchemyApi.getHistoricalTransactions(address, networkId, assetId);
    case EVMNetwork.AVALANCHE_TESTNET_FUJI:
      return await covalenthqApi.getHistoricalTransactions(address, networkId, assetId);
    default:
      throw new Error("Non Supported Network");
  }
};
