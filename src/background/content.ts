import { chrome } from "@polkadot/extension-inject/chrome"

const port = chrome.runtime.connect({ name: process.env.MESSAGING_PORT })
// handles from background to page
port.onMessage.addListener(function (data) {
  console.log("~ aba aq ra xdeba ? data", data)
  // if (data.message === "GET_ACCOUNTS") {
  window.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT }, "*")
  // }
})

// handles from page to background
window.addEventListener("message", ({ data, source }) => {
  if (source !== window || data.origin !== process.env.MESSAGE_ORIGIN_PAGE) {
    return
  }

  console.log("~ aba aq ?", data)
  port.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT })
  // if (data.message === "GET_ACCOUNTS") {
  // }
})

if (chrome?.extension?.getURL) {
  const script = document.createElement("script")
  script.src = chrome.extension.getURL("page.js")

  script.onload = (): void => {
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }
  ;(document.head || document.documentElement).appendChild(script)
}
