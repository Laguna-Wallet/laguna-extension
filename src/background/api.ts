import { chains, Messages, StorageKeys } from "./types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { executeTemporarily, getAccountAddresses, saveToStorage, transformTransfers } from "./utils"
import { formatBalance } from "@polkadot/util/format"

// todo make chains dynamic
export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama,moonriver,moonbeam,shiden,astar&vs_currencies=usd")
  const json = await data.json()
  return json
}

// todo make chains dynamic
export async function Retrieve_Coin_Infos() {
  const data = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot,kusama,moonriver,moonbeam,shiden,astar&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  )
  const json = await data.json()
  return json
}

export async function networkConnectors() {
  try {
    const Promises = chains.map(async (chain) => {
      const wsProvider = new WsProvider(`wss://${chain}.api.onfinality.io/ws?apikey=0dcf3660-e510-4df3-b9d2-bba6b16e3ae9`)
      const api = new ApiPromise({ provider: wsProvider })

      api.once("error", (error) => {
        console.log("error", error)
        api.disconnect()
      })

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
}

export async function fetchAccountsData(apis: any[]) {
  try {
    const addresses = getAccountAddresses()
    const userData = addresses.map((address) => fetchAccountData(address, apis))
    const resolvedData = await Promise.all(userData)

    saveToStorage({ key: StorageKeys.AccountBalances, value: JSON.stringify(resolvedData) })

    chrome.runtime.sendMessage({ type: Messages.AccountsBalanceUpdated, payload: JSON.stringify(resolvedData) })
    console.log("ballances updated")
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

export async function fetchAccountsTransactions() {
  const addresses = getAccountAddresses()
  let result_obj = {}

  let results = []
  let retrieved_count = 0
  let page = 0
  let accountTransfers = []
  for (let i = 0; i < addresses.length; i++) {
    for (let j = 0; j < chains.length; j++) {
      await timer(500)

      const res = await fetchTransactions(addresses[i], chains[j], page)

      if (!res?.data?.transfers) continue

      results = [...res?.data?.transfers]
      retrieved_count = res?.data?.count
      page++

      while (results.length < retrieved_count) {
        await timer(500)
        const data = await fetchTransactions(addresses[i], chains[j], page)
        results = [...results, ...data?.data?.transfers]
        page++
      }

      retrieved_count = 0
      page = 0

      result_obj[addresses[i]] = result_obj[addresses[i]] ? [...result_obj[addresses[i]], ...transformTransfers(results, chains[j])] : transformTransfers(results, chains[j])

      results = []
    }
  }

  console.log("transactions fetched")

  chrome.runtime.sendMessage({ type: Messages.TransactionsUpdated, payload: JSON.stringify(result_obj) })
  saveToStorage({ key: StorageKeys.Transactions, value: JSON.stringify(result_obj) })

  setTimeout(() => {
    fetchAccountsTransactions()
  }, 1000)
}

export async function fetchTransactions(address: string, chain: string, page: number) {
  const res = await fetch(`https://${chain}.api.subscan.io/api/scan/transfers`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, row: 30, page }),
  })

  return await res.json()
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms))
}
