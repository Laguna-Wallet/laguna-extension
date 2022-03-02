import { Messages, StorageKeys } from "./types"
import { fetchAccountsBalances, fetchAccountsTransactions, Retrieve_Coin_Decimals, Retrieve_Coin_Infos, Retrieve_Coin_Prices, sendTransaction } from "./api"
import { saveToStorage, validatePassword, handleInitialIdleTimeout, unlockKeyPairs, handleUnlockPair, removeFromKeypair } from "./utils"
// import keyring from "@polkadot/ui-keyring"
import { cryptoWaitReady } from "@polkadot/util-crypto"
import { injectExtension } from "@polkadot/extension-inject"
import { enable } from "./inject/enable"
import keyring from "@polkadot/ui-keyring"

// injectExtension(enable, { name: "laguna-wallet", version: "1.0.0" })

let isLoggedIn = false
let keyPairs = []

keyring.loadAll({ type: "ed25519" })

chrome.runtime.onMessage.addListener(async (msg) => {
  switch (msg.type) {
    case Messages.AuthUser:
      if (validatePassword(msg.payload.password)) {
        isLoggedIn = true
        keyPairs = unlockKeyPairs(msg.payload.password)
      }
      break
    case Messages.LogOutUser:
      isLoggedIn = false
      keyPairs = []
      break
    case Messages.RemoveFromKeyring:
      isLoggedIn = false
      keyPairs = removeFromKeypair(keyPairs, msg.payload.address)
      console.log("~ keyPairs", keyPairs)
      break

    case Messages.AuthCheck:
      chrome.runtime.sendMessage({ type: Messages.AuthCheck, payload: { isLoggedIn } })
      break
    case Messages.ChangeInterval:
      if (msg?.payload?.timeout) {
        chrome.idle.setDetectionInterval(Number(msg.payload.timeout) * 60)
      }
      break
    case Messages.SendTransaction:
      if (msg?.payload) {
        await sendTransaction(keyPairs, msg.payload)
      }
      break
    case Messages.AddToKeyring:
      const pair = handleUnlockPair(msg.payload)
      keyPairs = [...keyPairs, pair]
      break
  }
})

chrome.runtime.onInstalled.addListener(async () => {
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

  const timeout = await handleInitialIdleTimeout()
  chrome.idle.setDetectionInterval(Number(timeout))
  chrome.idle.onStateChanged.addListener((status: string) => {
    if (status === "idle") {
      isLoggedIn = false
    }
  })

  await Retrieve_Coin_Decimals()

  fetchAccountsBalances()
  // fetchAccountsTransactions()
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

  const timeout = handleInitialIdleTimeout()
  chrome.idle.setDetectionInterval(Number(timeout))
  chrome.idle.onStateChanged.addListener((status: string) => {
    if (status === "idle") {
      isLoggedIn = false
    }
  })

  await Retrieve_Coin_Decimals()

  // fetchAccountsBalances()
  // fetchAccountsTransactions()
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
})
