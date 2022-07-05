import "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initWasmAsm"

import { chains, Messages, networks, StorageKeys } from "./types"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { checkBalanceChange, getAccountAddresses, getFromStorage, recodeAddress, recodeToPolkadotAddress, saveToStorage, transformTransfers } from "./utils"
// import { decodePair } from "@polkadot/keyring/pair/decode"
// import { stringToU8a } from "@polkadot/util"
// import { base64Decode } from "@polkadot/util-crypto"
// import keyring from "@polkadot/ui-keyring"
// import { ethereumEncode } from "@polkadot/util-crypto"
import { cryptoWaitReady } from "@polkadot/util-crypto"
// import { initWasm } from "@polkadot/wasm-crypto/initOnlyAsm"

export async function Retrieve_balance_change_rates() {
  // const balances = getFromStorage()
}

export async function sendTransaction(pairs, { sendTo, sendFrom, amount, chain }) {
  try {
    const pair = pairs.find((pair) => {
      return recodeToPolkadotAddress(pair.address) === recodeToPolkadotAddress(sendFrom)
    })

    await cryptoWaitReady()
    const wsProvider = new WsProvider(`wss://${chain}.api.onfinality.io/public-ws?apikey=${process.env.ONFINALITY_KEY}`)
    const api = await ApiPromise.create({ provider: wsProvider })
    const unsub = await api.tx.balances.transfer(sendTo, amount).signAndSend(pair, ({ status }: any) => {
      if (status.isInBlock) {
        chrome.runtime.sendMessage({ type: Messages.TransactionSuccess, payload: { amount, chain, block: status?.asInBlock?.toString() } })
        unsub()
        api.disconnect()
      }
    })

    // setTimeout(() => {
    //   unsub()
    // }, 30000)
  } catch (err) {
    console.log(err)
  }
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
    // let transformedObj = {}
    // const data = []
    // for (let i = 0; i < chains.length; i++) {
    //   const chain = chains[i]
    //   await timer(500)

    //   const res = await fetch(`https://${chain}.api.subscan.io/api/scan/token`, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "X-API-Key": process.env.SUBSCAN_KEY,
    //     },
    //   })
    //   const json = await res.json()

    //   if (!json?.data?.detail) continue

    //   const obj: Record<string, Record<string, string>> = json?.data?.detail

    //   for (let [key, value] of Object.entries(obj)) {
    //     transformedObj[key] = value?.token_decimals
    //   }

    //   data.push(json)
    // }
    // todo revise with robin if it's ok to left decimals hardcoded for time being
    const transformedObj = {
      ASTR: 18,
      DOT: 10,
      GLMR: 18,
      KSM: 12,
      MOVR: 18,
      SDN: 18,
      WND: 12,
    }

    saveToStorage({ key: StorageKeys.TokenDecimals, value: JSON.stringify(transformedObj) })
    chrome.runtime.sendMessage({ type: Messages.TokenDecimalsUpdated, payload: JSON.stringify({ tokenDecimals: transformedObj }) })
  } catch (err) {
    Retrieve_Coin_Decimals()
    console.log(err)
  }
}

async function searchAccountBallance(chain: string, address: string) {
  if (!chain) return
  const res = await fetch(`https://${chain}.api.subscan.io/api/v2/scan/search`, {
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

  return await res.json()
}

export async function fetchAccountsBalances() {
  try {
    // await timer(3000)

    const account = await getFromStorage(StorageKeys.ActiveAccount)

    const balances = await getFromStorage(StorageKeys.AccountBalances)
    const parsedBalances = balances ? JSON.parse(balances) : {}

    if (account) {
      const address = JSON.parse(account as string).address
      let result_obj = {}
      let temp_obj = {}
      for (let i = 0; i < networks.length; i += 1) {
        await timer(1000)
        let network = networks[i]

        const resolved = await searchAccountBallance(network.chain, recodeAddress(address, network?.prefix, network?.encodeType))

        if (resolved.message === "Success") {
          temp_obj[network.chain] = { overall: Number(resolved.data.account.balance), locked: Number(resolved.data.account.balance_lock) }
        }

        if (parsedBalances.address === address) {
          const accountBalances = parsedBalances?.balances
          result_obj = { ...accountBalances, ...temp_obj }
        } else {
          result_obj = { ...temp_obj }
        }
      }

      const hasReceived: boolean = await checkBalanceChange(result_obj, address)

      saveToStorage({ key: StorageKeys.AccountBalances, value: JSON.stringify({ address, balances: result_obj }) })
      chrome.runtime.sendMessage({ type: Messages.AccountsBalanceUpdated, payload: JSON.stringify({ address, balances: result_obj }) })

      if (hasReceived) {
        chrome.runtime.sendMessage({ type: Messages.TokenReceived, payload: JSON.stringify({ tokenReceived: hasReceived }) })
      }
    }

    setTimeout(() => fetchAccountsBalances(), 3000)
  } catch (err) {
    setTimeout(() => fetchAccountsBalances(), 5000)
    console.log(err)
  }
}

// Transactions
// export async function fetchAccountsTransactions() {
//   try {
//     const addresses = getAccountAddresses()
//     let result_obj = {}

//     let results = []
//     let retrieved_count = 0
//     let page = 0
//     let accountTransfers = []
//     for (let i = 0; i < addresses.length; i++) {
//       for (let j = 0; j < chains.length; j++) {
//         await timer(500)

//         const res = await fetchTransactions(addresses[i], chains[j], page)

//         if (!res?.data?.transfers) continue

//         results = [...res?.data?.transfers]
//         retrieved_count = res?.data?.count
//         page++

//         while (results.length < retrieved_count) {
//           await timer(500)
//           const data = await fetchTransactions(addresses[i], chains[j], page)
//           results = [...results, ...data?.data?.transfers]
//           page++
//         }

//         retrieved_count = 0
//         page = 0

//         result_obj[addresses[i]] = result_obj[addresses[i]] ? [...result_obj[addresses[i]], ...transformTransfers(results, chains[j])] : transformTransfers(results, chains[j])

//         results = []
//       }
//     }

//     chrome.runtime.sendMessage({ type: Messages.TransactionsUpdated, payload: JSON.stringify(result_obj) })
//     saveToStorage({ key: StorageKeys.Transactions, value: JSON.stringify(result_obj) })

//     setTimeout(() => {
//       fetchAccountsTransactions()
//     }, 1000)
//   } catch (err) {
//     setTimeout(() => {
//       fetchAccountsTransactions()
//     }, 1000)
//   }
// }

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
