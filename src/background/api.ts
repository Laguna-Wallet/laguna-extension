import { chains, Messages, StorageKeys } from "./types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { executeTemporarily, getAccountAddresses, getFromStorage, saveToStorage, transformTransfers } from "./utils"
import { formatBalance } from "@polkadot/util/format"
import keyring from "@polkadot/ui-keyring"
import { json } from "stream/consumers"

// return formatBalance(balance.toJSON().data.free as number, { withSi: false, forceUnit: "-" }, decimals[index])

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

async function searchAccountBallance(chain: string, address: string) {
  if (!chain) return
  return await fetch(`https://${chain}.api.subscan.io/api/v2/scan/search`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "9fee43a931ab8240c6e2e7a5ec676458",
    },
    body: JSON.stringify({ key: address, row: 1, page: 1 }),
  })
}

export async function fetchAccountsBalances() {
  const account = getFromStorage(StorageKeys.ActiveAccount)

  if (account) {
    const address = JSON.parse(account).address

    let result_obj = {}

    for (let i = 0; i < chains.length; i += 1) {
      let pickedChains = [chains[i]]

      const Promises = pickedChains.map((chain) => searchAccountBallance(chain, address))
      const jsonPromises = (await Promise.all(Promises)).filter((res) => !!res).map((res) => res && res.json())

      const resolved = await Promise.all(jsonPromises)

      let balances = resolved.reduce((acc, item, index) => {
        const chain = pickedChains[index]
        if (item.message === "Success") {
          const balance = Number(item.data.account.balance)
          acc[chain] = balance
          return acc
        }
      }, {})

      result_obj = { ...result_obj, ...balances }
    }

    saveToStorage({ key: StorageKeys.AccountBalances, value: JSON.stringify({ address, balances: result_obj }) })
    chrome.runtime.sendMessage({ type: Messages.AccountsBalanceUpdated, payload: JSON.stringify({ address, balances: result_obj }) })
  }
  console.log("balances updated")
  setTimeout(() => fetchAccountsBalances(), 500)
}

// Transactions
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
