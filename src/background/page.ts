import { injectExtension } from "@polkadot/extension-inject"
import { handleResponse } from "./communication"
import { enable } from "./inject/enable"
import { isInPhishingList } from "./utils"

isInPhishingList(window.location.host).then((isDenied) => {
  if (!isDenied) {
    injectExtension(enable, { name: "laguna-wallet-js", version: "0.1.8-2" })
  }
})

window.addEventListener("message", ({ data, source }): void => {
  // || data.origin !== MESSAGE_ORIGIN_CONTENT
  if (source !== window && data.origin !== "MESSAGE_ORIGIN_CONTENT") {
    return
  }

  if (data.id && data.payload) {
    handleResponse(data)
  }
})
