import { ethers } from "ethers";
import { TokenData } from "./ethereumTypes"


const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`)

const contractAddresses = [
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    "eth" // Ethereum
]

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)"
]


export const getEthAccountBalances = async (contract: string, walletAddress: string): Promise<TokenData> => {
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

export const getEthAccounts = (walletAddress: string): TokenData[] => {
    const dataArray: TokenData[] = []

    contractAddresses.forEach(async element => {
        const data = getEthAccountBalances(element, walletAddress)
        dataArray.push(await data)
    });

    return dataArray
}
