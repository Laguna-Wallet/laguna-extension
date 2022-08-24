import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { getFromStorage, saveToStorage } from "utils/chrome";
import { changeAccountsBalances, changeEthereumBalances } from "../../redux/actions";
import { TokenData, Balance } from "./ethereumTypes"
import { networks, StorageKeys } from '../types';
import keyring from '@polkadot/ui-keyring';
import fs from "fs";
import { AES } from "crypto-js";
import Utf8 from "crypto-js/enc-utf8";



const contractAddress = [
    {
        "symbol": "USDT",
        "contractAddress": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
  ]

export const generateNewWalletAddress = (address: string): ethers.Wallet | string => {   
    const pair = keyring.getPair(address) 
    const wallet = ethers.Wallet.fromMnemonic(pair?.meta?.encodedSeed as string)
    return wallet;
}

export const importWalletAddress = async (JSON: any, password: string) => {
    const wallet = await ethers.Wallet.fromEncryptedJsonSync( JSON , password )
    return wallet
}


export const getFeeData = async (contractAddress: string, ReceiverAddress: string, amount: string) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)
    const abiFileName = "ERC20";
    const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
    const estimationData = await contract.estimateGas.transfer(ReceiverAddress, amount)
    return estimationData

}

export const buildEthereumTransaction = (receiverAddress: string, amount: string, gasPrice: Promise<ethers.BigNumber>, walletAddress: string) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)

    const tx = {
        to: receiverAddress,
        from: walletAddress,
        value: ethers.utils.parseUnits(amount, "ether"),
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(100000),
        nonce: provider.getTransactionCount(walletAddress, "latest"),
    }
    return tx
}

export const sendEthTransaction = async (password: string, amount: string, receiverAddress: string, contractAddress?: string): Promise<string> => {   
  
    const account = await getFromStorage(StorageKeys.ActiveAccount);
  
    if(account == null) {
      return "could not find valid account"
    }
  
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)
    const address = JSON.parse(account as string).address;
    const abiFileName = "ERC20";
    const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
  
    const wallet = await getWalletAddress(password, address)
  
    const gasPrice = provider.getGasPrice()
    const signer = wallet.connect(provider)
  
    if(contractAddress == null) {
      const tx = buildEthereumTransaction(receiverAddress, amount, gasPrice, wallet.address )
      const transaction = await signer.sendTransaction(tx)
      return transaction.hash;
  
    } else if (contractAddress) {
      getFeeData(contractAddress, receiverAddress, amount)
      const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
      const tokenSigner = contract.connect(signer)
      const transaction =  await tokenSigner.transfer(receiverAddress, amount)
      return transaction.hash;
    }
  
    return "invalid contract type"
  }

  export const getWalletAddress = async (password: string, address: string): Promise<ethers.Wallet> => {

    const pair = keyring.getPair(address) 
    const decodedSeed = AES.decrypt(
      pair?.meta?.encodedSeed  as string,
      password
    );
    const seed = decodedSeed.toString(Utf8);
  
    const wallet =  ethers.Wallet.fromMnemonic(seed)
    return wallet;
  }
  
  export const getERC20Balances = async (contract: string): Promise<Balance> => {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)
    const abiFileName = "ERC20";
    const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
    const account = await getFromStorage(StorageKeys.ActiveAccount);
    const address = JSON.parse(account as string).address;
    // TODO ask revaz how passwords are sourced
    const password = "Theviper12"
    const walletAddress = await getWalletAddress(password, address)

    const etherContract = new ethers.Contract(contract, ERC20ABI, provider)
    const balance = await etherContract.balanceOf(walletAddress.address)
  
    const balanceObject: Balance = {
        contractAddress: contract,
        amount: ethers.utils.formatUnits(balance)
    };

    
    return await Promise.resolve(balanceObject);
  }

  export const getETHAccountBalances = async (): Promise<Balance> => {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)
    const account = await getFromStorage(StorageKeys.ActiveAccount);
    const address = JSON.parse(account as string).address;
    const password = "Theviper12"
    const walletAddress = await getWalletAddress(password, address)
    const balance = await provider.getBalance(walletAddress.address)


    const balanceObject: Balance = {
      contractAddress: "ETH",
      amount: ethers.utils.formatEther(balance)
    };
    return await Promise.resolve(balanceObject)
  }
  
  export async function getERC20Accounts(dispatch: any
  ){
    const dataArray: Balance[] = []

    try {
      dataArray.push(await getETHAccountBalances())

      contractAddress.forEach(async element => {
            const data = await getERC20Balances(element.contractAddress)
            dataArray.push( data)
        });
  
        const tokenData: TokenData = {
            balances: dataArray
        }
  
        const storedBalance = {
            ethereum: tokenData
        }
  
        saveToStorage({
        key: StorageKeys.ethereumBalances,
        value: JSON.stringify(storedBalance)
        });

        dispatch(changeEthereumBalances(tokenData));
  
    } catch (err) {
        console.log(`error while fetching ethereum balances:${err}`)
    }
  
    }
  

// export const getEthAccountTransactions = async (contractAddress: string) => {
    
// }

export const getERC20AccountTransactions = async (contractAddress: string) => {
  const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)
  const account = await getFromStorage(StorageKeys.ActiveAccount);
  const abiFileName = "ERC20";
  const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
  const address = JSON.parse(account as string).address;
  const password = "Theviper12"
  const walletAddress = await getWalletAddress(password, address)
  const etherContract = new ethers.Contract(contractAddress, ERC20ABI, provider)

  const transactions = etherContract.filters.transfer(walletAddress, null)
  return transactions
}

export const getTransactionData = async() => {
    const transactionArray = []

try {
  
    contractAddress.forEach(element => {
       const transactions = getERC20AccountTransactions(element.contractAddress)
         transactionArray.push(transactions)
     })
    

    } catch(err) {
        console.log(`error getting ethereum transactions ${err}`)
    }    

}
