import { ethers, utils } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response, IEVMBuildTransactionOnChainParam, IEVMNetwork, IEVMHistoricalTransaction, IAlchemyTransferObject } from "./interfaces";
import fs from "fs";
import BigNumber from "bignumber.js";
import { EVMNetwork, networks } from "networks/evm";
import { assets, EVMAssetType } from "networks/evm/asset";

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

export const getAssetInfo = (network: EVMNetwork, assetId: string): IEVMAsset | IEVMAssetERC20 => {
  const asset = assets[network][assetId];
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

export const getGasPrice = async (network: EVMNetwork): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  const gasPrice = await provider.getGasPrice();
  return new BigNumber(gasPrice.toString());
};

export const estimateGas = async (network: EVMNetwork, toBeSignTransaction: IEVMToBeSignTransaction): Promise<BigNumber> => {
  const provider = new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  if (await isSmartContractAddress(network, toBeSignTransaction.to)) {
    const estimateResult = await provider.estimateGas(toBeSignTransaction);
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

export const getBuildTransactionOnChainParam = async (network: EVMNetwork, fromAddress: string, assetId: string)
: Promise<IEVMBuildTransactionOnChainParam> => {
  const networkInfo = networks[network];
  const [nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance] = await Promise.all([
    await getNonce(network, fromAddress),
    await getGasPrice(network),
    await getBalance(network, fromAddress, getAssetInfo(network, networkInfo.nativeCurreny)),
    await getBalance(network, fromAddress, getAssetInfo(network, assetId)),
  ]);
  return {
    nonce, gasPriceInGwei, nativeCurrenyBalance, assetBalance,
  };
};

export const buildTransaction = async (  param: IEVMBuildTransaction  )
: Promise<IEVMToBeSignTransaction> => {
  const {network, asset, amount, fromAddress, toAddress, nonce,gasPriceInGwei, gasLimit} = param;

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
    const contract = initERC20SmartContract(network, (asset as IEVMAssetERC20));
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

  export const getHistoricalTransactions = async (address: string, network: EVMNetwork, key?: string)
  : Promise<any> => {

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
          category: ["internal", "erc20", "external"],
          withMetadata: false,
          excludeZeroValue: false,
          fromAddress: address,
          ...(key && {pageKey: key}),
        },
      ],
    }),
  };

  const getTransactionReceipt = async (data: IAlchemyTransferObject[] ): Promise<IEVMHistoricalTransaction[]>  => {
    const transferReceipts: IEVMHistoricalTransaction[] = [];
    const provider = getProvider(network);

    data.forEach( async (transfer) => {
      const transactionData = await provider.getTransaction(transfer.hash);
      const transactionReceipt = await provider.getTransactionReceipt(transfer.hash);
      
      const transferObj: IEVMHistoricalTransaction  = {
        asset: transfer.asset,
        amount: new BigNumber(transfer.value),
        from: utils.getAddress(transfer.from),
        to: utils.getAddress(transfer.to),  
        fee: new BigNumber(transactionReceipt.gasUsed.mul(transactionReceipt.effectiveGasPrice)._hex),
        nonce: transactionData.nonce.toString(),
        blockNumber: new BigNumber(transactionReceipt.blockNumber),
        transactionHash: transfer.hash,
        timestamp: transactionData?.timestamp || 0,
      };
      transferReceipts.push(transferObj);
    });

    return transferReceipts;
  };


  try {
    const res = await fetch(networks[network].nodeUrl, options);
    const data = await res.json();
    const transfersList: IAlchemyTransferObject[] = data.result.transfers;
    const filteredList: IAlchemyTransferObject[] = transfersList.filter((receipt) => {
      return Object.values(assets[network]).find((object) => object.symbol === receipt.asset);
    });
    const result = await Promise.all([getTransactionReceipt(filteredList)]);
    return result;
  } catch(err) {
    console.error(err);
    return null;
  }
};


