import { decodeAddress, encodeAddress } from "@polkadot/keyring"
import { hexToU8a, isHex } from "@polkadot/util"
import { StorageKeys } from "./types"
import * as bcrypt from "bcryptjs"
import keyring from "@polkadot/ui-keyring"
import { cryptoWaitReady } from "@polkadot/util-crypto"
// const importFresh = require("import-fresh")

// Note: this utility functions will be needed for manifest V3
// export const getFromStorage = async function (key) {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.get(key, function (value) {
//         resolve(value[key])
//       })
//     } catch (ex) {
//       reject(ex)
//     }
//   })
// }

// export const saveToStorage = async function ({ key, value }) {
//   return new Promise((resolve, reject) => {
//     try {
//       chrome.storage.local.set({ [key]: value }, function () {
//         resolve("")
//       })
//     } catch (ex) {
//       reject(ex)
//     }
//   })
// }

export function saveToStorage({ key, value }: { key: string; value: string }) {
  localStorage.setItem(key, value)
}

export function getFromStorage(key: string) {
  return localStorage.getItem(key)
}

export function clearFromStorage(key: string) {
  return localStorage.removeItem(key)
}

export function validatePassword(password: string) {
  const hashed = getFromStorage(StorageKeys.Encoded)

  if (!hashed) return false
  return bcrypt.compareSync(password, hashed)
}

export function handleInitialIdleTimeout() {
  const timeout = getFromStorage(StorageKeys.IdleTImeout)
  if (timeout) {
    return Number(timeout) * 60
  } else {
    saveToStorage({ key: StorageKeys.IdleTImeout, value: "15" })
  }

  return 15 * 50
}

export function getAccountAddresses() {
  try {
    const local = localStorage
    const accountAddresses: string[] = []

    for (var key in local) {
      if (key.startsWith("account")) {
        const account = localStorage.getItem(key)
        const parsed = JSON.parse(account)

        if (isValidPolkadotAddress(parsed.address)) {
          accountAddresses.push(parsed.address)
        }
      }
    }

    return accountAddresses
  } catch (err) {
    console.warn(err)
  }
}

export function isValidPolkadotAddress(address: string): boolean {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
    return true
  } catch (error) {
    return false
  }
}

export function executeTemporarily(callback: () => void, milliseconds: number) {
  let keepGoing = true

  setTimeout(function () {
    keepGoing = false
  }, milliseconds)

  function Loop() {
    setTimeout(async function () {
      await callback()
      if (keepGoing) {
        Loop()
      }
    }, 3000)
  }

  Loop()
}

export function transformTransfers(transfers: any[], chain: string) {
  return transfers.map((transfer) => ({
    chain,
    amount: transfer?.amount,
    fee: transfer?.fee,
    from: transfer?.from,
    to: transfer?.to,
    nonce: transfer?.nonce,
    hash: transfer?.hash,
    timestamp: transfer?.block_timestamp,
  }))
}

export function unlockKeyPairs(password: string) {
  const a = keyring.keyring.getPairs()
  console.log("~ a", a)

  // const keyring = require("@polkadot/ui-keyring")

  // const pairs = keyring.getPairs()

  // // console.log("~ loaded", loaded)

  // const accounts = keyring.getAccounts()
  // console.log("~ accounts", accounts)

  // return pairs.map((pair) => {
  //   pair.unlock(password)
  //   return pair
  // })

  // class NewKeyring extends keyring {}
  ;(async () => {
    i++
  })()
  // ;(async () => {
  //   const b = await import("@polkadot/ui-keyring")
  //   b.keyring.loadAll({})
  //   console.log(b.keyring.getPairs())
  // })()

  // import("@polkadot/ui-keyring")
  //   .then((obj) => {
  //     obj.keyring.loadAll({})
  //     console.log(obj)
  //   })
  //   .catch((err) => {
  //     console.log("ieroriee", err)
  //   })

  return []
}

export function recodeToPolkadotAddress(address: string): string {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, 0)
}
