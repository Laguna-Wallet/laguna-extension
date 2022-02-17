import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import type { Signer as SignerInterface, SignerResult } from "@polkadot/api/types"
import keyring from "@polkadot/ui-keyring"
import { TypeRegistry } from "@polkadot/types"
import type { KeyringPair } from "@polkadot/keyring/types"
import { stringToU8a, u8aToHex } from "@polkadot/util"
// import { wrapBytes } from '@polkadot/extension-dapp/wrapBytes';

let nextId = 0

export async function signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
  const id = ++nextId
  const pair = keyring.getPair(payload.address)
  const signature = u8aToHex(pair.sign("message"))

  return {
    signature,
    id,
  }
}

export async function signRaw(payload: SignerPayloadRaw): Promise<SignerResult> {
  const id = ++nextId
  const pair = keyring.getPair(payload.address)
  const signature = u8aToHex(pair.sign("message"))

  return {
    signature,
    id,
  }
}
