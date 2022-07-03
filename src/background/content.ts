import { chrome } from "@polkadot/extension-inject/chrome"

// handles port disconnection after 5 minutes
let port;
function connect() {
   port = chrome.runtime.connect({ name: process.env.MESSAGING_PORT })
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener(msg => {
    console.log('received', msg, 'from background');
  });
}
connect();

// handles from background to page
port.onMessage.addListener(function (data) {
  window.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT, from: "window-postMessage" }, "*")
})

// handles from page to background
window.addEventListener("message", ({ data, source }) => {
  if (source !== window || data.origin !== process.env.MESSAGE_ORIGIN_PAGE) {
    return
  }

  port.postMessage({ ...data, origin: process.env.MESSAGE_ORIGIN_CONTENT })
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
