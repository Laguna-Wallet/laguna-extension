import { Injected } from '@polkadot/extension-inject/types';
import keyring from '@polkadot/ui-keyring';
import type { Signer as SignerInterface, SignerResult } from '@polkadot/api/types';
import { signPayload, signRaw } from './sign';
import { get, subscribe } from './accounts';

interface Account {
  address: string;
  genesisHash?: string;
  name?: string;
}

export async function enable(origin: string): Promise<Injected> {
  return {
    accounts: {
      get,
      subscribe
    },
    signer: {
      signPayload,
      signRaw
    }
  };
}
