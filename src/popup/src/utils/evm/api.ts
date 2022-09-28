import { ethers } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response, IEVMBuildTransactionOnChainParam, IEVMNetwork, IEVMHistoricalTransaction, IAlchemyTransferObject, IAlchemyTransferParam } from "./interfaces";
import fs from "fs";
import BigNumber from "bignumber.js";
import { EVMNetwork, nativeCurrencyByNetwork, networks, assetByNetwork, EVMAssetId, EVMAssetType, assets } from "networks/evm";

export const toCheckSumAddress = (address: string): string => {
  const checksumAddress = ethers.utils.getAddress(address); 
  return checksumAddress;
};

export const isValidEVMAddress = (address: string): Response => {
  try {
    if(!address.startsWith("0x")) throw "EVM address should start with 0x";
    if(address.length != 42) throw "invalid address length";
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

export const getNetworkInfo = (network: EVMNetwork): IEVMNetwork => {
  return networks[network];
};

export const getAssetInfo = (network: EVMNetwork, assetId: EVMAssetId): IEVMAsset | IEVMAssetERC20 => {
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

export const isSmartContractAddress = async (network: EVMNetwork, address: string): Promise<boolean> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const code =  await provider.getCode(toCheckSumAddress(address));
  return (!code);
};

export const calculateTransactionFeeInNormalUnit = (toBeSignTransaction: IEVMToBeSignTransaction): BigNumber => {
  return new BigNumber(toBeSignTransaction.gasLimit).multipliedBy(toBeSignTransaction.gasPrice).dividedBy("1E18");
};

export const getBuildTransactionOnChainParam = async (networkId: EVMNetwork, fromAddress: string, assetId: EVMAssetId): Promise<IEVMBuildTransactionOnChainParam> => {
  const [nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance] = await Promise.all([
    await getNonce(networkId, fromAddress),
    await getGasPrice(networkId),
    await getBalance(networkId, fromAddress, getAssetInfo(networkId, nativeCurrencyByNetwork[networkId])),
    await getBalance(networkId, fromAddress, getAssetInfo(networkId, assetId)),
  ]);
  return {
    nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance,
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
      gasLimit: `0x${gasLimit.toString(16)}`,
      nonce: `0x${nonce.toString(16)}`,
      chainId: networks[network].chainId,
    };
    return toBeSignTransaction;
  } else if (asset.assetType === EVMAssetType.ERC20) {
    const contract = initERC20SmartContract(network, (asset as IEVMAssetERC20));
    return {
      gasPrice: `0x${gasPriceInGwei.multipliedBy("1E9").toString(16)}`,
      gasLimit: `0x${gasLimit.toString(16)}`,
      nonce: `0x${nonce.toString(16)}`,
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

export const broadcastTransaction = async (network: EVMNetwork, signedTx: string): Promise<string> => {   
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
      const contract = initERC20SmartContract(network, (asset as IEVMAssetERC20));
      balanceInBaseUnit = await contract.balanceOf(address);
      break;
    }
  }
  return new BigNumber(balanceInBaseUnit).dividedBy(`1E${asset.decimal}`);
};

const initERC20SmartContract = (network: EVMNetwork, asset: IEVMAssetERC20): ethers.Contract => {
  const provider = getProvider(network);
  const abiFileName = "ERC20";
  const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
  return new ethers.Contract((asset as IEVMAssetERC20).contractAddress, ERC20ABI, provider);
};

export const getAssetIdBySmartContractAddress = (smartContractAddress: string, network: EVMNetwork): string | null => {
    const contractObject = Object.values(assetByNetwork[network]).find(
      (object) => {
        const asset =  object as IEVMAssetERC20;
        return toCheckSumAddress(asset.contractAddress) === toCheckSumAddress(smartContractAddress);
      });

      if(contractObject == null) {
        return null;
      }

    return contractObject.symbol;
};

export const getHistoricalTransactions = async (address: string, network: EVMNetwork, assetId: EVMAssetId)
: Promise<IEVMHistoricalTransaction[]> => {
  return getHistoricalTransactionsByAlchemy(address, network, assetId);
};

export const getHistoricalTransactionsByAlchemy = async (address: string, networkId: EVMNetwork, assetId: EVMAssetId, fromBlock?: BigNumber)
: Promise<IEVMHistoricalTransaction[]> => {
  const startTime = Date.now();
  try {
    // let pageKey: string | null = null;
    const historicalTransactions: IEVMHistoricalTransaction[] = [];
    const asset: IEVMAsset | IEVMAssetERC20 = assets[assetId];
    let category: string[];
    let contractAddresses: string[];
    switch (assets[assetId].assetType) {
      case EVMAssetType.NATIVE: {
        category = ["internal", "external"];
        contractAddresses = [];
        break;
      }
      case EVMAssetType.ERC20: {
        category = ["erc20"];
        contractAddresses = [(asset as IEVMAssetERC20).contractAddress];
        break;
      }
      default: 
        category = [];
        contractAddresses = [];
    }
    let param: IAlchemyTransferParam = {
      fromBlock: fromBlock?.isFinite()? `0x${fromBlock.toString(16)}` : "0x0",
      toBlock: "latest",
      category: category,
      withMetadata: false,
      excludeZeroValue: false,
      fromAddress: address,
    };
    if (asset.assetType !== EVMAssetType.NATIVE) {
      param = {
        ...param,
        contractAddresses,
      };
    }
    const options = {
      method: "POST",
      headers: {Accept: "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [param],
      }),
    };
  
    const provider = getProvider(networkId);
    const res = await fetch(networks[networkId].nodeUrl, options);
    const data = await res.json();
    // TODO remove log
    console.log("*** res", res);
    console.log("*** data", data);
    if (data.error) {
      throw data.error;
    }
    do {
      for (const transfer of data.result.transfers) {
          const transferObj: IEVMHistoricalTransaction  = {
            assetId: assetId.toString(),
            amount: new BigNumber(transfer.value),
            from: toCheckSumAddress(transfer.from),
            to: toCheckSumAddress(transfer.to),  
            fee: new BigNumber(0),
            nonce: new BigNumber(0),
            blockNumber: new BigNumber(transfer.blockNumber),
            transactionHash: transfer.hash,
            timestamp: 0,
          };
          historicalTransactions.push(transferObj);
      }
    } while (data.result.pageKey);
    // TODO remove log
    console.log("TimeTaken 1 - ", Date.now() - startTime);
    const chunkSize = 20;
    for(let i = 0; i < historicalTransactions.length; i += chunkSize) {
      const chunk = historicalTransactions.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map( async (historicalTransaction) => {
          const transaction =  await provider.getTransaction(historicalTransaction.transactionHash);
          // const transactionReceipt = await provider.getTransactionReceipt(historicalTransaction.transactionHash);
          // historicalTransaction.fee = new BigNumber(transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice)._hex);
          // historicalTransaction.nonce = new BigNumber(transaction.nonce);
          historicalTransaction.timestamp = transaction.timestamp? transaction.timestamp : 0;
        }));
    }
    // TODO remove log
    console.log("TimeTaken 2 - ", Date.now() - startTime);
    return historicalTransactions;
  } catch(err) {
    console.log("Failed to getHistoricalTransactionsByAlchemy", err);
    throw err;
  }
};
