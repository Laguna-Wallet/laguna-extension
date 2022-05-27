import type { SignerPayloadJSON, SignerPayloadRaw } from "@polkadot/types/types"
import type { Signer as SignerInterface, SignerResult } from "@polkadot/api/types"
import { sendMessage } from "../communication"
import { v4 as uuidv4 } from "uuid"

export async function signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
  console.log("parseInt", payload)

  const id = uuidv4()

  const result: any = await sendMessage("SIGN_PAYLOAD", payload)

  if (!result.approved) return Promise.reject(new Error("Auth Declined"))

  return {
    ...result,
    id,
  }
}

export async function signRaw(payload: SignerPayloadRaw): Promise<SignerResult> {
  const id = uuidv4()

  const signature: any = await sendMessage("SIGN_RAW", payload)

  if (!signature) return Promise.reject(new Error("Auth Declined"))

  return {
    id,
    signature,
  }
}
