import { chains, Messages, StorageKeys } from "./types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { executeTemporarily, getAccountAddresses, saveToStorage } from "./utils"
import { formatBalance } from "@polkadot/util/format"

export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama&vs_currencies=usd")
  const json = await data.json()
  return json
}

export async function Retrieve_Coin_Infos() {
  const data = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot,kusama&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
  const json = await data.json()
  return json
}

export async function networkConnectors() {
  try {
    const Promises = chains.map(async (chain) => {
      const wsProvider = new WsProvider(`wss://${chain}.api.onfinality.io/ws?apikey=0dcf3660-e510-4df3-b9d2-bba6b16e3ae9`)
      const api = new ApiPromise({ provider: wsProvider })
      await api.isReady
      return api
    })

    return await Promise.all(Promises)
  } catch (err) {
    console.log("err", err)
  }
}

export async function fetchAccountsBalances() {
  try {
    const apis = await networkConnectors()
    executeTemporarily(() => fetchAccountsData(apis), 170000)
  } catch (err) {
    console.log("err", err)
  }
  //   setInterval(async () => {
  //     await fetchAccountsData(apis)
  //   }, 1000)
}

export async function fetchAccountsData(apis: any[]) {
  try {
    const addresses = getAccountAddresses()
    const userData = addresses.map((address) => fetchAccountData(address, apis))
    const resolvedData = await Promise.all(userData)

    saveToStorage({ key: StorageKeys.AccountBalances, value: JSON.stringify(resolvedData) })

    console.log("ballances updated")
    chrome.runtime.sendMessage({ type: Messages.AccountsBalanceUpdated, payload: JSON.stringify(resolvedData) })
  } catch (err) {
    console.log("err", err)
  }
}

export async function fetchAccountData(address, apis: any[]) {
  try {
    const BalancePromises = apis.map((api) => api.query.system.account(address))
    const DecimalPromises = apis.map((api) => api.registry.chainDecimals[0])

    const balances = await Promise.all(BalancePromises)
    const decimals = await Promise.all(DecimalPromises)

    const freeBalances = balances.map((balance, index) => {
      return formatBalance(balance.toJSON().data.free as number, { withSi: false, forceUnit: "-" }, decimals[index])
    })

    const balancesObj = freeBalances.reduce((acc, balance, index) => {
      acc[chains[index]] = balance

      return acc
    }, {})

    return { address, balances: balancesObj }
  } catch (err) {
    console.log("err", err)
  }
}
