import { Messages, StorageKeys } from "./types"
import { fetchAccountsBalances, fetchAccountsData, fetchAccountsTransactions, fetchAllBalance, networkConnectors, Retrieve_Coin_Infos, Retrieve_Coin_Prices } from "./api"
import { saveToStorage } from "./utils"
import { enable } from "./inject/enable"
import { injectExtension } from "@polkadot/extension-inject"
import keyring from "@polkadot/ui-keyring"
import { cryptoWaitReady } from "@polkadot/util-crypto"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled...")

  const prices = await Retrieve_Coin_Prices()
  chrome.runtime.sendMessage({ type: Messages.PriceUpdated, payload: JSON.stringify(prices) })
  saveToStorage({ key: StorageKeys.TokenPrices, value: JSON.stringify(prices) })
  console.log("Prices injected...")

  const Infos = await Retrieve_Coin_Infos()
  chrome.runtime.sendMessage({ type: Messages.CoinInfoUpdated, payload: JSON.stringify(Infos) })
  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })
  console.log("info injected...")

  chrome.alarms.create("refresh", { periodInMinutes: 1 })

  chrome.alarms.create("refetch-account-balances", { periodInMinutes: 3 })

  chrome.idle.setDetectionInterval(15)
  chrome.idle.onStateChanged.addListener((status: string) => {
    console.log("status", status)
  })

  fetchAccountsBalances()

  // fetchAllBalance()

  fetchAccountsTransactions()
})

// injectExtension(enable, { name: "polkadot-js/apps", version: "1.0.1" })

chrome.runtime.onConnect.addListener((port): void => {
  console.log("~ port", port)
  // shouldn't happen, however... only listen to what we know about
  // assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`)

  port.onMessage.addListener((data: any) => {
    console.log("~ data", data)
  })
  // message and disconnect handlers
  // port.onMessage.addListener((data: TransportRequestMessage<keyof RequestSignatures>) => handlers(data, port))
  // port.onDisconnect.addListener(() => console.log(`Disconnected from ${port.name}`))
})

chrome.runtime.onStartup.addListener(async () => {
  const prices = await Retrieve_Coin_Prices()
  chrome.runtime.sendMessage({ type: Messages.PriceUpdated, payload: JSON.stringify(prices) })

  saveToStorage({ key: StorageKeys.TokenPrices, value: JSON.stringify(prices) })
  console.log("Prices injected...")

  const Infos = await Retrieve_Coin_Infos()
  chrome.runtime.sendMessage({ type: Messages.CoinInfoUpdated, payload: JSON.stringify(Infos) })
  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })
  console.log("info injected...")

  chrome.alarms.create("refresh", { periodInMinutes: 1 })

  chrome.alarms.create("refetch-account-balances", { periodInMinutes: 3 })

  chrome.idle.setDetectionInterval(15)
  chrome.idle.onStateChanged.addListener((status: string) => {
    console.log("status", status)
  })

  fetchAccountsBalances()

  fetchAccountsTransactions()
})

chrome.alarms.onAlarm.addListener(async (alarm) => {
  // coin prices
  const prices = await Retrieve_Coin_Prices()
  chrome.runtime.sendMessage({ type: Messages.PriceUpdated, payload: JSON.stringify(prices) })
  saveToStorage({ key: StorageKeys.TokenPrices, value: JSON.stringify(prices) })

  // coin info
  const Infos = await Retrieve_Coin_Infos()
  chrome.runtime.sendMessage({ type: Messages.CoinInfoUpdated, payload: JSON.stringify(Infos) })
  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })

  if (alarm.name === "refetch-account-balances") {
    await fetchAccountsBalances()
  }
})
