import { Retrieve_Coin_Prices } from "./utils"

chrome.runtime.onInstalled.addListener(async () => {
  console.log("onInstalled...")
  // create alarm after extension is installed / upgraded
  chrome.alarms.create("refresh", { periodInMinutes: 1 })

  const price = await Retrieve_Coin_Prices()
})

// Update Prices
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log(alarm.name) // refresh
  console.log("Prices Updated !!!")

  chrome.runtime.sendMessage({ msg: "hello there" })
})

// const arrayData = await browser.runtime.sendMessage({type: 'get_array'});
// browser.runtime.onMessage.addListener(data => {
//  if (data.type === 'get_array') return Promise.resolve([1, 2, 3, 4]);
// });
