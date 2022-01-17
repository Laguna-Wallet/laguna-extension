export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama&vs_currencies=usd")
  const json = await data.json()
  console.log("~ json", json)
  return json
}

export async function Retrieve_Coin_Prices() {
  const data = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=polkadot,kusama&vs_currencies=usd")
  const json = await data.json()
  console.log("~ json", json)
  return json
}
