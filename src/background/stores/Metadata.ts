import type { MetadataDef } from "@polkadot/extension-inject/types"

import BaseStore from "./Base"

export default class MetadataStore extends BaseStore<MetadataDef> {
  constructor() {
    super(`${process.env.EXTENSION_PREFIX}metadata`)
  }
}
