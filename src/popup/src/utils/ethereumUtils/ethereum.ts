import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { TokenData } from "./ethereumTypes"


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


export const getEthAccountBalances = async (contract: string, walletAddress: string): Promise<TokenData> => {
    const dispatch = useDispatch();
    
    if(contract === "eth") {
        const balance = await provider.getBalance(walletAddress)
       return await Promise.resolve({
            symbol: "ETH",
            balance: ethers.utils.formatEther(balance)
        })
    }

    const etherContract = new ethers.Contract(contract, ERC20_ABI, provider)
    const balance = await etherContract.balanceOf(walletAddress)
    const symbol = await etherContract.symbol()

    const result = await Promise.resolve({
        symbol: symbol,
        balance: ethers.utils.formatEther(balance)
    })
    
    return result;
}

export const getERC20Accounts = (walletAddress: string): TokenData[] => {
    const dataArray: TokenData[] = []

    contractAddresses.forEach(async element => {
        const data = getEthAccountBalances(element, walletAddress)
        dataArray.push(await data)
    });

    return dataArray
}

export const generateNewWalletAddress = (phrase: string): ethers.Wallet | string => {    
    const wallet = ethers.Wallet.createRandom()
    return wallet;
}

export const importWalletAddress = async (JSON: any, password: string) => {
    const wallet = await ethers.Wallet.fromEncryptedJsonSync( JSON , password )
    return wallet
}

export const sendERC20Transaction = async (contractAddress: string, senderAddress: string, ReceiverAddress: string , phrase:    string, amount: string) => {
    const wallet = ethers.Wallet.fromMnemonic(phrase)
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


