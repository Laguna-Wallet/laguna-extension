import { InjectedAccount, Unsubcall } from "@polkadot/extension-inject/types"
import keyring from "@polkadot/ui-keyring"

export function get(): Promise<InjectedAccount[]> {
  return new Promise((resolve, reject) => {
    const accounts: InjectedAccount[] = keyring.getPairs().map((pair: any) => ({
      address: pair.address,
      genesisHash: pair.meta.genesisHash,
      name: pair.meta.name,
    }))
    resolve(accounts)
  })
}

export function subscribe(cb: (accounts: InjectedAccount[]) => unknown): Unsubcall {
  return (): void => {
    console.log("to be implemented")
  }
}
