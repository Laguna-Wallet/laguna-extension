import { chrome } from "@polkadot/extension-inject/chrome"

const port = chrome.runtime.connect({ name: process.env.MESSAGING_PORT })
// handles from background to page
port.onMessage.addListener(function (data) {
  // if (data.message === "GET_ACCOUNTS") {
  window.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT, from: "window-postMessage" }, "*")
  // }
})

// handles from page to background
window.addEventListener("message", ({ data, source }) => {
  if (source !== window || data.origin !== process.env.MESSAGE_ORIGIN_PAGE) {
    return
  }

  port.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT })
  // if (data.message === "GET_ACCOUNTS") {
  // }
})

console.log("~ chrome?.extension?.getURL", chrome?.extension?.getURL)
if (chrome?.extension?.getURL) {
  const script = document.createElement("script")
  console.log(chrome.extension.getURL("page.js"))
  script.src = chrome.extension.getURL("page.js")

  script.onload = (): void => {
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }
  ;(document.head || document.documentElement).appendChild(script)
}
