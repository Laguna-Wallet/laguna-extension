import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { StorageKeys } from "../../../../background/types";
import { changeAccountsBalances, changeEthereumBalances } from "../../redux/actions";
import { getFromStorage, saveToStorage } from './chrome';
import { EthereumBalanceData, Balance } from "./ethereumTypes"


const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)

// Array of contract addresses specific to ERC-20 tokens (ETH is a native token so it does not have an address)
const contractAddresses = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "eth" // Ethereum
]

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)"
]


export const getEthAccountBalances = async (contract: string): Promise<Balance> => {
    const walletAddress = ''

    if(contract === "eth") {
        const balance = await provider.getBalance(walletAddress)
           const balanceObject: Balance = {
            contractAddress: "eth",
            amount: balance
           };
       return await Promise.resolve(balanceObject)
    }

    const etherContract = new ethers.Contract(contract, ERC20_ABI, provider)
    const balance = await etherContract.balanceOf(walletAddress)

    const balanceObject: Balance = {
        contractAddress: contract,
        amount: balance
    };
    
    return await Promise.resolve(balanceObject);
}

export const getERC20Accounts = async (dispatch: any
) => {
    const walletAddress = ""
    const dataArray: Balance[] = []
    const balances = await getFromStorage(StorageKeys.AccountBalances);


    try {
        contractAddresses.forEach(async element => {
            const data = getEthAccountBalances(element)
            dataArray.push(await data)
        });

         const tokenData: EthereumBalanceData = {
            address: walletAddress,
            balances: dataArray
        }

        const storedBalance = {
            polkodot: {...balances.polkodot},
            ethereum: tokenData
        }

        saveToStorage({
        key: StorageKeys.AccountBalances,
        value: JSON.stringify(storedBalance)
        });

        dispatch(changeEthereumBalances(tokenData));

        setTimeout(() => getERC20Accounts(dispatch), 3000);
    } catch (err) {
        setTimeout(() => getERC20Accounts(dispatch), 3000);
        console.log(`error while fetching ethereum balances:${err}`)
    }

    }
   

export const generateNewWalletAddress = (): ethers.Wallet | string => {    
    const wallet = ethers.Wallet.createRandom()
    return wallet;
}

export const importWalletAddress = async (JSON: any, password: string) => {
    const wallet = await ethers.Wallet.fromEncryptedJsonSync( JSON , password )
    return wallet
}

export const sendERC20Transaction = async (contractAddress: string, ReceiverAddress: string , amount: string) => {
    const privateKey = ''
    const balances = await getFromStorage(StorageKeys.AccountBalances);
    const wallet = new ethers.Wallet(privateKey, provider);

    if(contractAddress === "eth") {
        const tx = await wallet.sendTransaction({
            to: ReceiverAddress,
            value: ethers.utils.parseEther(amount)
        })
        await tx.wait()
        return
    }
    
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
    const walletContract = contract.connect(wallet)
    const tx = await walletContract.transfer(ReceiverAddress, amount)
    await tx.await()

}

export const getFeeData = async (contractAddress: string, ReceiverAddress: string, amount: string) => {
    if(contractAddress === "eth") {
        const data = provider.getFeeData()
       return await data
    }

    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
    const estimationData = await contract.estimateGas.transfer(ReceiverAddress, amount)
    return estimationData


}

export const getEthAccountTransactions = async (contractAddress: string): Promise<Record<string, string>> => {
    const walletAddress = ''

    // if(contract === "eth") {
    //     const balance = await provider.getBalance(walletAddress)
    //        const balanceObject: Balance = {
    //         contractAddress: "eth",
    //         amount: balance
    //        };
    //    return await Promise.resolve(balanceObject)
    // }

    const etherContract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
    const transactions = etherContract.filters.transfer(walletAddress, null)
    
    return await transactions 
    
}

export const getTransactionData = async() => {
    const transactionArray = []

try {
    contractAddresses.forEach(element => {
       const transactions = getEthAccountTransactions(element)
         transactionArray.push(transactions)
     })
    

    
    saveToStorage({
        key: StorageKeys.EthereumTransactions,
        value: JSON.stringify(transactionObj)
        });

    } catch(err) {
        console.log(`error getting ethereum transactions ${err}`)
    }    

}

