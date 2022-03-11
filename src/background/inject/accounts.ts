import { InjectedAccount, Unsubcall } from "@polkadot/extension-inject/types"
import { sendMessage } from "../communication"
import { recodeAddress } from "../utils"

export function get(): Promise<InjectedAccount[]> {
  return new Promise(async (resolve, reject) => {
    const accounts = await sendMessage("GET_ACCOUNTS")
    const transformedAccounts: InjectedAccount[] = accounts.map((pair: any) => ({
      name: pair.meta.name,
      address: pair.address,
      meta: pair.meta,
      type: pair.type,
      addressRaw: pair.addressRaw,
      publicKey: pair.publicKey,
    }))

    resolve(transformedAccounts)
  })
}

export function subscribe(cb: (accounts: InjectedAccount[]) => unknown): Unsubcall {
  return (): void => {
    // const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void => cb(transformAccounts(accounts)))
    // return true
  }
}
