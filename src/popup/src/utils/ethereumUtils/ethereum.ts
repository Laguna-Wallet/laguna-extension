import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { getFromStorage, saveToStorage } from "utils/chrome";
import { StorageKeys } from "../../../../background/types";
import { changeAccountsBalances, changeEthereumBalances } from "../../redux/actions";
import { TokenData, Balance } from "./ethereumTypes"
import keyring from '@polkadot/ui-keyring';
import fs from "fs";


const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/IFip5pZqfpAsi50-O2a0ZEJoA82E8KR_`)

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)"
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

export const sendERC20Transaction = async (contractAddress: string, ReceiverAddress: string , senderAddress: string, amount: string) => {
    const abiFileName = "ERC20";
    const ERC20ABI = JSON.parse(fs.readFileSync(`./abi/${abiFileName}.json`, "utf-8"));
    const balances = await getFromStorage(StorageKeys.AccountBalances);
    const pair = keyring.getPair(senderAddress) 
    const wallet = ethers.Wallet.fromMnemonic(pair?.meta?.encodedSeed as string)


    if(contractAddress === "eth") {
        const tx = await wallet.sendTransaction({
            to: ReceiverAddress,
            value: ethers.utils.parseEther(amount)
        })
        await tx.wait()
        return
    }
    
    const contract = new ethers.Contract(contractAddress, ERC20ABI, provider)
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

export const getEthAccountTransactions = async (contractAddress: string) => {
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
    
}

// export const getTransactionData = async() => {
//     const transactionArray = []

// try {
//     contractAddresses.forEach(element => {
//        const transactions = getEthAccountTransactions(element)
//          transactionArray.push(transactions)
//      })
    

    
//     saveToStorage({
//         key: StorageKeys.EthereumTransactions,
//         value: JSON.stringify(transactionObj)
//         });

//     } catch(err) {
//         console.log(`error getting ethereum transactions ${err}`)
//     }    

// }
