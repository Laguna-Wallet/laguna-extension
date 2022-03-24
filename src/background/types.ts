export enum StorageKeys {
  SignedIn = "signed-in",
  Encoded = "encoded",
  LoggedOut = "logged-out",
  ActiveAccount = "active-account",
  TokenPrices = "token-prices",
  TokenInfos = "token-infos",
  AccountBalances = "account-balances",
  Transactions = "transactions",
  TokenDecimals = "token-decimals",
  IdleTImeout = "idle-timeout",
}

export enum Messages {
  PriceUpdated = "PRICES_UPDATED",
  CoinInfoUpdated = "COIN_INFO_UPDATED",
  AccountsBalanceUpdated = "ACCOUNTS_BALANCE_UPDATED",
  TransactionsUpdated = "TRANSACTIONS_UPDATED",
  TokenDecimalsUpdated = "TOKEN_DECIMALS_UPDATED",
  AuthUser = "AUTH_USER",
  LogOutUser = "LOG_OUT_USER",
  AuthCheck = "AUTH_CHECK",
  ChangeInterval = "CHANGE_INTERVAL",
  SendTransaction = "SEND_TRANSACTION",
  TransactionSuccess = "TRANSACTION_SUCCESS",
  ReopenKeyPairs = "REOPEN_KEYPAIRS",
  AddToKeyring = "ADD_TO_KEYRING",
  RemoveFromKeyring = "REMOVE_FROM_KEYRING",
  ReEncryptPairs = "RE_ENCRYPT_PAIRS",
  DappAuthorization = "DAPP_AUTHORIZATION",
  CheckPendingDappAuth = "CHECK_PENDING_DAPP_AUTH",
  DappAuthRequest = "DAPP_AUTH_REQUEST",
  CheckPendingSign = "CHECK_PENDING_SIGN",
  SignRequest = "SIGN_REQUEST",
  ConnectedApps = "CONNECTED_APPS",
  RevokeDapp = "REVOKE_DAPP",
  TokenReceived= "TOKEN_RECEIVED"
}

export const chains = ["westend", "polkadot", "kusama", "moonriver", "moonbeam", "shiden", "astar"]

export interface Network {
  name: string
  symbol: string
  chain: string
  node: string
  price_change_percentage_24h?: number
  marketCap?: number
  encodeType?: string
  prefix: number
}

export interface TokenInfo {
  current_price: number
  id: string
  market_cap: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  name: string
  symbol: string
}

export const networks: Network[] = [
  {
    name: "Polkadot",
    symbol: "wnd",
    chain: "westend",
    node: "wss://westend-rpc.polkadot.io",
    prefix: 42,
  },
  {
    name: "Polkadot",
    symbol: "dot",
    chain: "polkadot",
    node: "wss://rpc.polkadot.io",
    prefix: 0,
  },
  {
    name: "Kusama",
    symbol: "ksm",
    chain: "kusama",
    node: "wss://kusama-rpc.polkadot.io",
    prefix: 2,
  },
  {
    name: "Moonriver",
    symbol: "movr",
    chain: "moonriver",
    node: "wss://moonriver-rpc.polkadot.io",
    prefix: 1285,
    encodeType: "ethereum",
  },
  {
    name: "Moonbeam",
    symbol: "glmr",
    chain: "moonbeam",
    // chain: ' moonbeam-alpha',
    node: "wss://moonbeam-rpc.polkadot.io",
    encodeType: "ethereum",
    prefix: 1284,
  },
  {
    name: "Shiden",
    symbol: "sdn",
    chain: "shiden",
    node: "wss://shiden.api.onfinality.io/public-ws",
    prefix: 5,
  },
  {
    name: "Astar",
    symbol: "astr",
    chain: "astar",
    node: "wss://astar.api.onfinality.io/public-ws",
    prefix: 5,
  },
]
