// import "@polkadot/wasm-crypto/initOnlyAsm"
import { Messages, StorageKeys } from "./types"
import {
  fetchAccountsBalances,
  // fetchAccountsTransactions,
  Retrieve_Coin_Decimals,
  Retrieve_Coin_Infos,
  Retrieve_Coin_Prices,
  sendTransaction,
} from "./api"

import {
  saveToStorage,
  validatePassword,
  handleInitialIdleTimeout,
  unlockKeyPairs,
  handleUnlockPair,
  removeFromKeypair,
  reEncryptKeyringPairs,
  recodeToPolkadotAddress,
  isInPhishingList,
  getFromStorage,
  renewMetaToKeyPairs,
} from "./utils"
import keyring from "@polkadot/ui-keyring"
import { TypeRegistry } from "@polkadot/types"
import { AccountsStore } from "./stores"
import { cryptoWaitReady } from "@polkadot/util-crypto"
import type { KeyringPair } from "@polkadot/keyring/types"

// import { getCurrentTab } from "./utils"

// import { initWasm } from "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initWasmAsm"

let isLoggedIn = false
let keyPairs: KeyringPair[] = []
let signRequestPending = false
let signRequest = {}
const registry = new TypeRegistry()

let authorizedDapps = []
let pendingRequests = []
let declinedDapps = []

let timeout = 900000
let timeoutStart = Date.now()

keyring.loadAll({ ss58Format: 0, type: "ed25519", store: new AccountsStore() })

function onMessage(msg, port) {}

function forceReconnect(port) {
  deleteTimer(port)
  port.disconnect()
}

function deleteTimer(port) {
  if (port._timer) {
    clearTimeout(port._timer)
    delete port._timer
  }
}

chrome.runtime.onConnect.addListener((port: any) => {
  if (port.name !== "keep_alive") return

  port.onMessage.addListener(onMessage)

  port.onDisconnect.addListener(deleteTimer)
  port.timer = setTimeout(forceReconnect, 4500, port)
})

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === "complete") {
//     chrome.scripting
//       .executeScript({
//         target: { tabId },
//         files: ["content.js"],
//       })
//       .then(() => {
//       })
//       .catch((err) => console.log("err", err))
//   }
// })

chrome.runtime.onConnect.addListener(function (port) {
  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === Messages.DappAuthRequest) {
      // const dappName = msg.payload.pendingDapp[0].request.requestOrigin
      const dappName = window.location.host
      if (authorizedDapps.includes(dappName) || declinedDapps.includes(dappName)) return
      if (msg.payload.approved) {
        pendingRequests = []
        authorizedDapps.push(dappName)

        port.postMessage({ ...msg.payload.pendingDapp[0], payload: { id: msg.payload.pendingDapp[0].id, approved: true } })
        sendResponse({})
        return true
      } else {
        pendingRequests = []
        declinedDapps.push(dappName)
        port.postMessage({ ...msg.payload.pendingDapp[0], payload: { id: msg.payload.pendingDapp[0].id, approved: false } })
        return true
      }
    }
    if (msg.type === Messages.SignRequest) {
      const data = msg?.payload?.data?.data
      if (msg.payload.approved) {
        const pair = keyPairs.find((pair) => {
          return recodeToPolkadotAddress(pair.address) === recodeToPolkadotAddress(data.request.address)
        })
        if (data.message === "SIGN_PAYLOAD") {
          await cryptoWaitReady()
          registry.setSignedExtensions(data.request.signedExtensions)
          const result = registry.createType("ExtrinsicPayload", data.request, { version: data.request.version }).sign(pair)
          port.postMessage({ ...data, payload: { id: data.id, approved: true, ...result } })
        }
      } else {
        port.postMessage({ ...data, payload: { id: data.id, approved: false } })
      }
      signRequestPending = false
      signRequest = {}
    }
  })

  port.onMessage.addListener(async (data) => {
    if (data.message === "GET_ACCOUNTS") {
      port.postMessage({ ...data, payload: keyring.getPairs() })
    }
    if (data.message === "SIGN_PAYLOAD") {
      const POPUP_URL = chrome.runtime.getURL("popup/index.html")
      chrome.windows.create({
        focused: true,
        height: 621,
        left: 150,
        top: 150,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })
      signRequestPending = true
      signRequest = data
      // const pair = keyring.getPair(data.request.address)
      // registry.setSignedExtensions(data.request.signedExtensions)
      // check for signing
      // pair.unlock("123123123")
      // const result = registry.createType("ExtrinsicPayload", data.request, { version: data.request.version }).sign(pair)
      // port.postMessage({ ...data, payload: { id: data.id, ...result } })
    }
    if (data.message === "SIGN_RAW") {
      const POPUP_URL = chrome.runtime.getURL("popup/index.html")
      chrome.windows.create({
        focused: true,
        height: 621,
        left: 150,
        top: 150,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })
      signRequestPending = true
      signRequest = data
      // const pair = keyring.getPair(data.request.address)
      // registry.setSignedExtensions(data.request.signedExtensions)
      // pair.unlock("123123123")
      // const result = u8aToHex(pair.sign(wrapBytes(data.request)))
      // registry.createType("ExtrinsicPayload", data.request, { version: data.request.version }).sign(pair)
      // port.postMessage({ ...data, payload: { id: data.id, result } })
    }
    if (data.message === "AUTHORIZE_TAB") {
      // const host = new URL((await getCurrentTab()).url).host

      const hasBoarded = Boolean(await getFromStorage(StorageKeys.OnBoarding))

      // if no account is created don't allow dap to connect
      if (!hasBoarded) {
        port.postMessage({ ...data, payload: { id: data.id, approved: false } })
      }

      isInPhishingList(window.location.host).then((isDenied) => {
        if (isDenied) {
          port.postMessage({ ...data, payload: { id: data.id, approved: false } })
          return
        }
      })

      if (authorizedDapps.includes(window.location.host)) {
        port.postMessage({ ...data, payload: { id: data.id, approved: true } })
        return true
      }

      if (declinedDapps.includes(window.location.host)) {
        port.postMessage({ ...data, payload: { id: data.id, approved: false } })
        return false
      }

      const POPUP_URL = chrome.runtime.getURL("popup/index.html")
      if (pendingRequests.length === 0) {
        pendingRequests.push(data)
      }
      chrome.windows.create({
        focused: true,
        height: 621,
        left: 150,
        top: 150,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })
    }
  })
})

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  switch (msg.type) {
    case Messages.AuthUser:
      if (validatePassword(msg.payload.password)) {
        isLoggedIn = true
        timeoutStart = Date.now()
        keyPairs = unlockKeyPairs(msg.payload.password)
      }
      break
    case Messages.CheckPendingDappAuth:
      chrome.runtime.sendMessage({ type: Messages.DappAuthorization, payload: { pendingDappAuthorization: pendingRequests } })
      sendResponse({ type: Messages.DappAuthorization, payload: { pendingDappAuthorization: pendingRequests } })
      break
    case Messages.LogOutUser:
      isLoggedIn = false
      keyPairs = []
      break

    case Messages.CheckPendingSign:
      chrome.runtime.sendMessage({ type: Messages.CheckPendingSign, payload: { pending: signRequestPending, data: signRequest } })
      sendResponse({ type: Messages.CheckPendingSign, payload: { pending: signRequestPending, data: signRequest } })
      break
    case Messages.RemoveFromKeyring:
      isLoggedIn = false
      keyPairs = removeFromKeypair(keyPairs, msg.payload.address)
      break
    case Messages.ConnectedApps:
      chrome.runtime.sendMessage({ type: Messages.ConnectedApps, payload: { connectedApps: authorizedDapps } })
      break
    case Messages.AuthCheck:
      sendResponse({ payload: { isLoggedIn } })
      break
    case Messages.RevokeDapp:
      authorizedDapps = authorizedDapps.filter((item) => item !== msg.payload.dappName)
      chrome.runtime.sendMessage({ type: Messages.ConnectedApps, payload: { connectedApps: authorizedDapps } })
      break
    case Messages.ChangeInterval:
      if (msg?.payload?.timeout) {
        timeout = msg?.payload?.timeout
        timeoutStart = Date.now()
      }
      break
    case Messages.Timeout:
      sendResponse({ payload: { timeout } })
      break
    case Messages.ResetTimeout:
      if (isLoggedIn) {
        timeoutStart = Date.now()
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
    case Messages.ReEncryptPairs:
      keyPairs = renewMetaToKeyPairs(keyPairs, msg.payload.metaData)
      keyPairs = reEncryptKeyringPairs(keyPairs, msg.payload.oldPassword, msg.payload.newPassword)
      break
  }
})

chrome.runtime.onInstalled.addListener(async (port) => {
  const prices = await Retrieve_Coin_Prices()
  chrome.runtime.sendMessage({ type: Messages.PriceUpdated, payload: JSON.stringify(prices) })

  saveToStorage({ key: StorageKeys.TokenPrices, value: JSON.stringify(prices) })

  const Infos = await Retrieve_Coin_Infos()
  chrome.runtime.sendMessage({ type: Messages.CoinInfoUpdated, payload: JSON.stringify(Infos) })

  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })

  chrome.alarms.create("check-timeout", { periodInMinutes: 1 })
  chrome.alarms.create("refetch-account-balances", { periodInMinutes: 3 })
  chrome.alarms.create("24-hr-ballance-change", { periodInMinutes: 3600 })

  chrome.alarms.create("keep alive", { periodInMinutes: 1 })

  // const timeout = await handleInitialIdleTimeout()
  // chrome.idle.setDetectionInterval(Number(timeout))
  // chrome.idle.onStateChanged.addListener((status: string) => {
  //   if (status === "idle") {
  //     isLoggedIn = false
  //   }
  // })

  await Retrieve_Coin_Decimals()

  fetchAccountsBalances()

  // fetchAccountsTransactions()
})

chrome.runtime.onStartup.addListener(async () => {
  const prices = await Retrieve_Coin_Prices()
  chrome.runtime.sendMessage({ type: Messages.PriceUpdated, payload: JSON.stringify(prices) })
  saveToStorage({ key: StorageKeys.TokenPrices, value: JSON.stringify(prices) })

  const Infos = await Retrieve_Coin_Infos()
  chrome.runtime.sendMessage({ type: Messages.CoinInfoUpdated, payload: JSON.stringify(Infos) })
  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })

  chrome.alarms.create("refresh", { periodInMinutes: 1 })
  chrome.alarms.create("refetch-account-balances", { periodInMinutes: 3 })
  chrome.alarms.create("24-hr-ballance-change", { periodInMinutes: 3600 })

  // const timeout = handleInitialIdleTimeout()
  // // chrome.idle.setDetectionInterval(Number(timeout))
  // chrome.idle.onStateChanged.addListener((status: string) => {
  //   if (status === "idle") {
  //     isLoggedIn = false
  //   }
  // })

  await Retrieve_Coin_Decimals()

  fetchAccountsBalances()

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

  if (alarm.name === "24-hr-ballance-change") {
    // const balance24hrChangeRate = Retrieve_balance_change_rates()
  }

  // check if login-timeout has passed
  if (Date.now() - timeoutStart > timeout) {
    isLoggedIn = false
    keyPairs = []
  }
})
