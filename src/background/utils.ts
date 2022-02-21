import { decodeAddress, encodeAddress } from "@polkadot/keyring"
import { hexToU8a, isHex } from "@polkadot/util"

export function saveToChromeStorage(key: string, value: string) {
  chrome.storage.local.set({ key: value }, function () {
    console.log("Value is set to " + JSON.stringify(value))
  })
}

export function saveToStorage({ key, value }: { key: string; value: string }) {
  localStorage.setItem(key, value)
}

export function getFromStorage(key: string) {
  return localStorage.getItem(key)
}

export function getAccountAddresses() {
  try {
    const local = localStorage
    const accountAddresses: string[] = []

    for (var key in local) {
      if (key.startsWith("account")) {
        const account = localStorage.getItem(key)
        const parsed = JSON.parse(account)

        if (isValidAddressPolkadotAddress(parsed.address)) {
          accountAddresses.push(parsed.address)
        }
      }
    }

    return accountAddresses
  } catch (err) {
    console.warn(err)
  }
}

export function isValidAddressPolkadotAddress(address: string): boolean {
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
