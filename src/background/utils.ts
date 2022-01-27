export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama&vs_currencies=usd")
  const json = await data.json()
  return json
}

export async function Retrieve_Coin_Infos() {
  const data = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=polkadot,kusama&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
  const json = await data.json()
  return json
}

export function saveToStorage({ key, value }: { key: string; value: string }) {
  localStorage.setItem(key, value)
}

export function saveToChromeStorage(key: string, value: string) {
  chrome.storage.local.set({ key: value }, function () {
    console.log("Value is set to " + JSON.stringify(value))
  })
}
