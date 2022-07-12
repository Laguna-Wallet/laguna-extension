// import "@polkadot/wasm-crypto/initOnlyAsm"
import { Messages, StorageKeys } from "./types"
import { u8aToHex } from "@polkadot/util"
import { wrapBytes } from "@polkadot/extension-dapp/wrapBytes"
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
  clearAccountsFromStorage,
} from "./utils"

import keyring from "@polkadot/ui-keyring"
import { TypeRegistry } from "@polkadot/types"
import { AccountsStore } from "./stores"
import { cryptoWaitReady } from "@polkadot/util-crypto"
import type { KeyringPair } from "@polkadot/keyring/types"
import assert = require("assert")
import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import { hexToString } from "@polkadot/util"
import browser from "webextension-polyfill"

// import { getCurrentTab } from "./utils"

// import { initWasm } from "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initOnlyAsm"
// import "@polkadot/wasm-crypto/initWasmAsm"

let isLoggedIn = false
let keyPairs: KeyringPair[] = []
let signRequestPending = false
let signRequest = {}
let signRawRequestPending = false
let signRawRequest = {}
const registry = new TypeRegistry()

let authorizedDapps = []
let pendingRequests = []
let declinedDapps = []

let timeout = 900000
let timeoutStart = Date.now()

cryptoWaitReady().then(() => {
  // load all available addresses and accounts
  keyring.loadAll({
    ss58Format: 42,
    type: "sr25519",
    store: new AccountsStore(),
  })
})

browser.runtime.onConnect.addListener(function (port) {
  assert([process.env.MESSAGING_PORT, process.env.PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`)

  browser.runtime.onMessage.addListener(async (msg) => {
    if (msg.type === Messages.RevokeDapp) {
      authorizedDapps = authorizedDapps.filter((item) => item !== msg.payload.dappName)
    }

    if (msg.type === Messages.DappAuthRequest) {
      try {
        const dappName = msg.payload.pendingDapp[0].request.requestOrigin
        // const dappName = window.location.host

        if (authorizedDapps.includes(dappName) || declinedDapps.includes(dappName)) return
        // POPUP_CONTENT popup content will assure that request is coming from popup
        if (msg.payload.approved && msg?.payload?.POPUP_CONTENT === process.env.POPUP_CONTENT) {
          pendingRequests = []
          authorizedDapps.push(dappName)
          port.postMessage({
            ...msg.payload.pendingDapp[0],
            payload: { id: msg.payload.pendingDapp[0].id, approved: true },
          })
          return true
        } else {
          pendingRequests = []
          declinedDapps.push(dappName)
          port.postMessage({
            ...msg.payload.pendingDapp[0],
            payload: { id: msg.payload.pendingDapp[0].id, approved: false },
          })
          return true
        }
      } catch (err) {
        console.log("err", err)
      }
    }

    if (msg.type === Messages.SignRequest) {
      try {
        const data = msg?.payload?.data?.data
        // POPUP_CONTENT popup content will assure that request is coming from popup
        if (msg.payload.approved && msg?.payload?.POPUP_CONTENT === process.env.POPUP_CONTENT) {
          const pair = keyPairs.find((pair) => {
            return recodeToPolkadotAddress(pair.address) === recodeToPolkadotAddress(data.request.address)
          })

          if (data.message === "SIGN_PAYLOAD") {
            await cryptoWaitReady()
            registry.setSignedExtensions(data.request.signedExtensions)
            const result = registry
              .createType("ExtrinsicPayload", data.request, {
                version: data.request.version,
              })
              .sign(pair)
            port.postMessage({
              ...data,
              payload: { id: data.id, approved: true, ...result },
            })
          }
        } else {
          port.postMessage({
            ...data,
            payload: { id: data.id, approved: false },
          })
        }
        signRequestPending = false
        signRequest = {}
      } catch (err) {
        console.log("err", err)
      }
    }

    if (msg.type === Messages.SignRawRequest) {
      const data = msg?.payload?.pendingDapp?.data
      // POPUP_CONTENT popup content will assure that request is coming from popup
      if (msg.payload.approved && msg?.payload?.POPUP_CONTENT === process.env.POPUP_CONTENT) {
        const pair = keyPairs.find((pair) => {
          return recodeToPolkadotAddress(pair.address) === recodeToPolkadotAddress(data.request.address)
        })

        if (data.message === "SIGN_RAW") {
          await cryptoWaitReady()
          const signature = u8aToHex(pair.sign(wrapBytes(data.request.data)))
          port.postMessage({
            ...data,
            payload: {
              id: data.id,
              approved: true,
              ...data.request,
              signature,
            },
          })
        }
      } else {
        port.postMessage({
          ...data,
          payload: { id: data.id, approved: false },
        })
      }
      signRawRequestPending = false
      signRawRequest = {}
    }
  })

  port.onMessage.addListener(async (data) => {
    const dappName = data?.request?.requestOrigin

    if (data.message === "GET_ACCOUNTS") {
      port.postMessage({ ...data, payload: keyring.getPairs() })
    }

    if (data.message === "SIGN_PAYLOAD") {
      const POPUP_URL = browser.runtime.getURL("popup/index.html")
      browser.windows.create({
        focused: true,
        height: 621,
        left: 1250,
        top: 100,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })
      signRequestPending = true
      signRequest = data
    }
    if (data.message === "SIGN_RAW") {
      const POPUP_URL = browser.runtime.getURL("popup/index.html")
      browser.windows.create({
        focused: true,
        height: 621,
        left: 1250,
        top: 100,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })

      signRawRequestPending = true
      signRawRequest = data
    }

    if (data.message === "AUTHORIZE_TAB") {
      // const host = new URL((await getCurrentTab()).url).host

      const hasBoarded = Boolean(await getFromStorage(StorageKeys.OnBoarding))

      // if no account is created don't allow dap to connect
      if (!hasBoarded) {
        port.postMessage({
          ...data,
          payload: { id: data.id, approved: false },
        })
      }

      // todo check tab name differently
      isInPhishingList(dappName).then((isDenied) => {
        if (isDenied) {
          port.postMessage({
            ...data,
            payload: { id: data.id, approved: false },
          })
          return
        }
      })

      if (authorizedDapps.includes(dappName)) {
        port.postMessage({ ...data, payload: { id: data.id, approved: true } })
        return true
      }

      if (declinedDapps.includes(dappName)) {
        port.postMessage({
          ...data,
          payload: { id: data.id, approved: false },
        })
        return false
      }

      const POPUP_URL = browser.runtime.getURL("popup/index.html")
      if (pendingRequests.length === 0) {
        pendingRequests.push(data)
      }

      browser.windows.create({
        focused: true,
        height: 621,
        left: 1250,
        top: 100,
        type: "popup",
        url: POPUP_URL,
        width: 370,
      })
    }
  })
})

browser.runtime.onMessage.addListener(async (msg, _sender) => {
  switch (msg.type) {
    case Messages.AuthUser:
      if (validatePassword(msg.payload.password)) {
        isLoggedIn = true
        timeoutStart = Date.now()
        keyPairs = unlockKeyPairs(msg.payload.password)
      }
      break
    case Messages.CheckPendingDappAuth:
      chrome.runtime.sendMessage({
        type: Messages.DappAuthorization,
        payload: { pendingDappAuthorization: pendingRequests },
      })
      return {
        type: Messages.DappAuthorization,
        payload: { pendingDappAuthorization: pendingRequests },
      }
      // sendResponse({
      //   type: Messages.DappAuthorization,
      //   payload: { pendingDappAuthorization: pendingRequests },
      // })
      break
    case Messages.LogOutUser:
      isLoggedIn = false
      keyPairs = []
      break

    case Messages.CheckPendingSign:
      chrome.runtime.sendMessage({
        type: Messages.CheckPendingSign,
        payload: { pending: signRequestPending, data: signRequest },
      })
      return {
        type: Messages.CheckPendingSign,
        payload: { pending: signRequestPending, data: signRequest },
      }
      // sendResponse({
      //   type: Messages.CheckPendingSign,
      //   payload: { pending: signRequestPending, data: signRequest },
      // })
      break
    case Messages.CheckPendingSignRaw:
      chrome.runtime.sendMessage({
        type: Messages.CheckPendingSignRaw,
        payload: { pending: signRawRequestPending, data: signRawRequest },
      })
      return {
        type: Messages.CheckPendingSignRaw,
        payload: { pending: signRawRequestPending, data: signRawRequest },
      }
      // sendResponse({
      //   type: Messages.CheckPendingSignRaw,
      //   payload: { pending: signRawRequestPending, data: signRawRequest },
      // })
      break
    case Messages.RemoveFromKeyring:
      isLoggedIn = false
      keyPairs = removeFromKeypair(keyPairs, msg.payload.address)
      break
    case Messages.ForgotPassword:
      isLoggedIn = false
      const newPair = handleUnlockPair(msg.payload)
      clearAccountsFromStorage(newPair.address)
      keyPairs = [newPair]
      break
    case Messages.ConnectedApps:
      chrome.runtime.sendMessage({
        type: Messages.ConnectedApps,
        payload: { connectedApps: authorizedDapps },
      })
      break
    case Messages.AuthCheck:
      return { payload: { isLoggedIn } }
      // sendResponse({ payload: { isLoggedIn } })
      break
    case Messages.RevokeDapp:
      authorizedDapps = authorizedDapps.filter((item) => item !== msg.payload.dappName)
      chrome.runtime.sendMessage({
        type: Messages.ConnectedApps,
        payload: { connectedApps: authorizedDapps },
      })
      break
    case Messages.ChangeInterval:
      if (msg?.payload?.timeout) {
        timeout = msg?.payload?.timeout
        timeoutStart = Date.now()
      }
      break
    case Messages.Timeout:
      return { payload: { timeout } }
      // sendResponse({ payload: { timeout } })
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
    // case Messages.FreezeAccountBalanceUpdate:
    //   saveToStorage({ key: StorageKeys.IsAccountBalanceUpdateFreezed, value: JSON.stringify({ isFreezed: true }) })
    //   setTimeout(() => {
    //     saveToStorage({ key: StorageKeys.IsAccountBalanceUpdateFreezed, value: JSON.stringify({ isFreezed: false }) })
    //   }, 100000)
  }
})

browser.runtime.onInstalled.addListener(async (port) => {
  const prices = await Retrieve_Coin_Prices()
  browser.runtime.sendMessage({
    type: Messages.PriceUpdated,
    payload: JSON.stringify(prices),
  })

  saveToStorage({
    key: StorageKeys.TokenPrices,
    value: JSON.stringify(prices),
  })

  const Infos = await Retrieve_Coin_Infos()
  browser.runtime.sendMessage({
    type: Messages.CoinInfoUpdated,
    payload: JSON.stringify(Infos),
  })

  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })

  browser.alarms.create("check-timeout", { periodInMinutes: 1 })
  browser.alarms.create("refetch-account-balances", { periodInMinutes: 3 })
  browser.alarms.create("24-hr-ballance-change", { periodInMinutes: 3600 })

  browser.alarms.create("keep alive", { periodInMinutes: 1 })

  await Retrieve_Coin_Decimals()

  fetchAccountsBalances()

  // fetchAccountsTransactions()
})

browser.runtime.onStartup.addListener(async () => {
  const prices = await Retrieve_Coin_Prices()
  browser.runtime.sendMessage({
    type: Messages.PriceUpdated,
    payload: JSON.stringify(prices),
  })
  saveToStorage({
    key: StorageKeys.TokenPrices,
    value: JSON.stringify(prices),
  })

  const Infos = await Retrieve_Coin_Infos()
  browser.runtime.sendMessage({
    type: Messages.CoinInfoUpdated,
    payload: JSON.stringify(Infos),
  })
  saveToStorage({ key: StorageKeys.TokenInfos, value: JSON.stringify(Infos) })

  browser.alarms.create("refresh", { periodInMinutes: 1 })
  browser.alarms.create("refetch-account-balances", { periodInMinutes: 3 })
  browser.alarms.create("24-hr-ballance-change", { periodInMinutes: 3600 })

  await Retrieve_Coin_Decimals()

  fetchAccountsBalances()

  // fetchAccountsTransactions()
})

browser.alarms.onAlarm.addListener(async (alarm) => {
  // coin prices
  const prices = await Retrieve_Coin_Prices()
  browser.runtime.sendMessage({
    type: Messages.PriceUpdated,
    payload: JSON.stringify(prices),
  })
  saveToStorage({
    key: StorageKeys.TokenPrices,
    value: JSON.stringify(prices),
  })

  // coin info
  const Infos = await Retrieve_Coin_Infos()
  browser.runtime.sendMessage({
    type: Messages.CoinInfoUpdated,
    payload: JSON.stringify(Infos),
  })
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
