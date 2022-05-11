import { v4 as uuidv4 } from "uuid"

export interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data?: any) => void
  reject: (error: Error) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void
}

const handlers: Record<string, Handler> = {}

export function sendMessage(message, request?: any, subscriber?: (data: unknown) => void): Promise<any> {
  return new Promise((resolve, reject): void => {
    const id = uuidv4()

    handlers[id] = { reject, resolve, subscriber }

    const transportRequestMessage = {
      id,
      message,
      origin: process.env.MESSAGE_ORIGIN_PAGE,
      request,
      url: window.location.href,
    }

    window.postMessage(transportRequestMessage, "*")
  })
}

export function handleResponse(data): void {
  const handler = handlers[data.id]

  if (!handler) {
    return
  }

  if (!handler.subscriber) {
    delete handlers[data.id]
  }

  if (data.subscription) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    ;(handler.subscriber as Function)(data.subscription)
  } else if (data.error) {
    handler.reject(new Error(data.error))
  } else {
    handler.resolve(data.payload)
  }
}
