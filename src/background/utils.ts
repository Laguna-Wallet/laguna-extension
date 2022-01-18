export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama&vs_currencies=usd")
  const json = await data.json()
  console.log("~ json", json)
  return json
}

export function saveToStorage(key: string, value: string) {
  chrome.storage.local.set({ key: value }, function () {
    console.log("Value is set to " + JSON.stringify(value))
  })
}
