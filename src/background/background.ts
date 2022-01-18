import { StorageKeys } from "./types"
import { Retrieve_Coin_Prices, saveToStorage } from "./utils"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled...")
  // create alarm after extension is installed / upgraded
  chrome.alarms.create("refresh", { periodInMinutes: 1 })

  const price = await Retrieve_Coin_Prices()
  saveToStorage(StorageKeys.TokenPrices, price)
})

// Update Prices
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const price = await Retrieve_Coin_Prices()
  saveToStorage(StorageKeys.TokenPrices, price)
  chrome.runtime.sendMessage({ msg: "Prices_updated" })
})

// const arrayData = await browser.runtime.sendMessage({type: 'get_array'});
// browser.runtime.onMessage.addListener(data => {
//  if (data.type === 'get_array') return Promise.resolve([1, 2, 3, 4]);
// });
