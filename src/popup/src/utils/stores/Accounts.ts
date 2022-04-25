import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

import BaseStore from './Base';

export default class AccountsStore extends BaseStore<KeyringJson> implements KeyringStore {
  constructor() {
    super(process.env.EXTENSION_PREFIX ? `${process.env.EXTENSION_PREFIX}accounts` : null);
  }

  public override set(key: string, value: KeyringJson, update?: () => void): void {
    // shortcut, don't save testing accounts in extension storage
    if (key.startsWith('account:') && value.meta && value.meta.isTesting) {
      update && update();

      return;
    }

    super.set(key, value, update);
  }
}
