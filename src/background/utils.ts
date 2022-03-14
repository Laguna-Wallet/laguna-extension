import { decodeAddress, encodeAddress } from "@polkadot/keyring"
import { hexToU8a, isHex } from "@polkadot/util"
import { StorageKeys } from "./types"
import * as bcrypt from "bcryptjs"
import keyring from "@polkadot/ui-keyring"
import AES from "crypto-js/aes"
import Utf8 from "crypto-js/enc-utf8"
import { ethereumEncode } from "@polkadot/util-crypto"
import { checkIfDenied } from "@polkadot/phishing"

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

    for (const key in local) {
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

export function handleUnlockPair(payload) {
  if (payload?.json) {
    const pair = keyring.restoreAccount(payload.json, payload.jsonPassword)
    const newPair = encryptKeyringPair(pair, payload.jsonPassword, payload.password)
    return newPair
  }

  if (payload.seed) {
    const { pair } = keyring.addUri(payload.seed, payload.password)
    keyring.saveAccountMeta(pair, { name: pair.address })
    return pair
  }
}

export function encryptKeyringPair(pair: any, oldPassword: string, newPassword: string) {
  pair.unlock(oldPassword)
  const { pair: newPair } = keyring.addPair(pair, newPassword)
  keyring.saveAccountMeta(newPair, { ...pair.meta })
  return newPair
}

export function unlockKeyPairs(password: string) {
  const pairs = keyring.getPairs()

  return pairs.map((pair) => {
    pair.unlock(password)
    return pair
  })
}

export function removeFromKeypair(pairs, address) {
  keyring.forgetAccount(address)
  return pairs.filter((item) => recodeToPolkadotAddress(item.address) !== recodeToPolkadotAddress(address))
}

export function recodeToPolkadotAddress(address: string): string {
  const publicKey = decodeAddress(address)
  return encodeAddress(publicKey, 0)
}

export function reEncryptKeyringPairs(oldPassword: string, newPassword: string) {
  encryptKeyringPairs(oldPassword, newPassword)
  encryptMetaData(oldPassword, newPassword)
}

export function encryptKeyringPairs(oldPassword: string, newPassword: string) {
  const pairs = keyring.getPairs()

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    pair.unlock(oldPassword)

    const { pair: newPair } = keyring.addPair(pair, newPassword)
    keyring.saveAccountMeta(newPair, { ...pair.meta })
  }
}

export function recodeAddress(address: string, prefix: any, type?: string): string {
  if (type === "ethereum") {
    const raw = decodeAddress(address)
    return ethereumEncode(raw)
  }

  const raw = decodeAddress(address)
  return encodeAddress(raw, prefix)
}

export function encryptMetaData(oldPassword: string, newPassword: string) {
  const pairs = keyring.getPairs()

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]
    const meta = pair.meta

    // decode key and encode with new password
    if (meta?.encodedKey) {
      const decodedKeyBytes = AES.decrypt(meta?.encodedKey as string, oldPassword)
      const decodedKey = decodedKeyBytes.toString(Utf8)

      const reEncodedKey = AES.encrypt(decodedKey, newPassword).toString()
      keyring.saveAccountMeta(pair, { ...pair.meta, encodedKey: reEncodedKey })
    }

    // decode seed and encode with new password
    if (meta?.encodedSeed) {
      const decodedSeedBytes = AES.decrypt(meta?.encodedSeed as string, oldPassword)
      const decodedSeed = decodedSeedBytes.toString(Utf8)

      const reEncodedSeed = AES.encrypt(decodedSeed, newPassword).toString()
      keyring.saveAccountMeta(pair, { ...pair.meta, encodedSeed: reEncodedSeed })
    }
  }
}

export async function isInPhishingList(url: string): Promise<boolean> {
  const isInDenyList = await checkIfDenied(url)

  if (isInDenyList) {
    return true
  }

  return false
}
