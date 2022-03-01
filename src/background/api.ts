import { chains, Messages, StorageKeys } from "./types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { executeTemporarily, getAccountAddresses, getFromStorage, recodeToPolkadotAddress, saveToStorage, transformTransfers } from "./utils"
import { formatBalance } from "@polkadot/util/format"
// import keyring from "@polkadot/ui-keyring"

// return formatBalance(balance.toJSON().data.free as number, { withSi: false, forceUnit: "-" }, decimals[index])

export async function sendTransaction(pairs, { sendTo, sendFrom, amount, chain }) {
  let hex = ""

  const pair = pairs.find((pair) => {
    return recodeToPolkadotAddress(pair.address) === recodeToPolkadotAddress(sendFrom)
  })

  const wsProvider = new WsProvider(`wss://${chain}.api.onfinality.io/ws?apikey=${process.env.ONFINALITY_KEY}`)
  const api = await ApiPromise.create({ provider: wsProvider })

  const unsub = await api.tx.balances.transfer(sendTo, amount).signAndSend(pair, ({ status }: any) => {
    if (status.isInBlock) {
      console.log(`Completed at block hash #${status.asInBlock.toString()}`)
      hex = status.asInBlock.toString()
      chrome.runtime.sendMessage({ type: Messages.TransactionSuccess, payload: hex })
      unsub()
    } else {
      console.log(`Current status: ${status.type}`)
    }
  })
}

// todo make chains dynamic
export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama,moonriver,moonbeam,shiden,astar&vs_currencies=usd")
  const json = await data.json()
  return json
}

// todo make chains dynamic
// todo proper typing and get rid of unneeded fields from the return object
export async function Retrieve_Coin_Infos() {
  const data = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot,kusama,moonriver,moonbeam,shiden,astar&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  )

  return await data.json()
}

export async function Retrieve_Coin_Decimals() {
  try {
    let transformedObj = {}
    const data = []
    for (let i = 0; i < chains.length; i++) {
      const chain = chains[i]
      const res = await fetch(`https://${chain}.api.subscan.io/api/scan/token`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.SUBSCAN_KEY,
        },
      })

      const json = await res.json()
      const obj: Record<string, Record<string, string>> = json.data.detail

      for (let [key, value] of Object.entries(obj)) {
        transformedObj[key] = value?.token_decimals
      }

      data.push(json)
    }

    saveToStorage({ key: StorageKeys.TokenDecimals, value: JSON.stringify(transformedObj) })
    chrome.runtime.sendMessage({ type: Messages.TokenDecimalsUpdated, payload: JSON.stringify({ tokenDecimals: transformedObj }) })
  } catch (err) {
    console.log(err)
    Retrieve_Coin_Decimals()
  }
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
      "X-API-Key": process.env.SUBSCAN_KEY,
    },
    body: JSON.stringify({ key: address, row: 1, page: 1 }),
  })
}

export async function fetchAccountsBalances() {
  try {
    const account = getFromStorage(StorageKeys.ActiveAccount)

    if (account) {
      const address = JSON.parse(account as string).address

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
  } catch (err) {
    fetchAccountsBalances()
    console.log("err", err)
  }
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
      "X-API-Key": process.env.SUBSCAN_KEY,
    },
    body: JSON.stringify({ address, row: 30, page }),
  })

  return await res.json()
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms))
}
