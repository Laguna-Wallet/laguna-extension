import { chrome } from "@polkadot/extension-inject/chrome"

export function parseEssentialDetails() {
  let main: any = {}

  main.performance = JSON.parse(JSON.stringify(window.performance)) || null
  return main
}
// todo asap from .env
const port = chrome.runtime.connect({ name: process.env.MESSAGING_PORT })
// handles from background to page
port.onMessage.addListener(function (data) {
  // if (data.message === "GET_ACCOUNTS") {
  window.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT }, "*")
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
