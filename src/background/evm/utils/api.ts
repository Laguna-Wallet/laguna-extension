import { ethers } from "ethers";
import { IEVMAssetERC20, IEVMAsset, IEVMBuildTransaction, IEVMToBeSignTransaction, Response, } from "../../../popup/src/utils/evm/interfaces"
import { EVMAssetType } from "../../../popup/src/utils/evm/networks/asset";
import { EVMNetwork, networks } from "../../../popup/src/utils/evm/networks";

export const getProvider = (network: EVMNetwork): ethers.providers.JsonRpcProvider => {
    return new ethers.providers.JsonRpcProvider(networks[network].nodeUrl);
  }
  


export const signTransaction = async (network: EVMNetwork, wallet: ethers.Wallet, toBeSignTransaction: IEVMToBeSignTransaction): Promise<string> => {
    const provider = getProvider(network);
    const signer = wallet.connect(provider);
    const signedTx = signer.signTransaction(toBeSignTransaction);
   return signedTx;
  };
