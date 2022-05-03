import { chrome } from "@polkadot/extension-inject/chrome"

// need to keep alive service_worker
let keepAlivePort
function connect() {
  keepAlivePort = chrome.runtime.connect({ name: "keep_alive" })
  keepAlivePort.onDisconnect.addListener(connect)
  keepAlivePort.onMessage.addListener((msg) => {
    console.log("received", msg, "from bg")
  })
}
// connect()

const port = chrome.runtime.connect({ name: process.env.MESSAGING_PORT })
// handles from background to page
port.onMessage.addListener(function (data) {
  if (data.message === "GET_ACCOUNTS") {
    window.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT, from: "window-postMessage" }, "*")
  }
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

if (chrome.runtime.getURL) {
  const script = document.createElement("script")
  console.log(chrome.runtime.getURL("page.js"))
  script.src = chrome.runtime.getURL("page.js")

  script.onload = (): void => {
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }
  ;(document.head || document.documentElement).appendChild(script)
}
