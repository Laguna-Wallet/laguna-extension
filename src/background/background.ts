import { Messages, StorageKeys } from "./types"
import { fetchAccountsBalances, fetchAccountsData, networkConnectors, Retrieve_Coin_Infos, Retrieve_Coin_Prices } from "./api"
import { saveToStorage } from "./utils"

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

  await fetchAccountsBalances()
})

chrome.runtime.onStartup.addListener(function () {
  console.log("open")
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