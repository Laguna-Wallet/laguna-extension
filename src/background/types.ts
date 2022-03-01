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
}

export const chains = ["westend", "polkadot", "kusama", "moonriver", "moonbeam", "shiden", "astar"]
