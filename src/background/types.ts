export enum StorageKeys {
  SignedIn = "signed-in",
  Encoded = "encoded",
  LoggedOut = "logged-out",
  ActiveAccount = "active-account",
  TokenPrices = "token-prices",
  TokenInfos = "token-infos",
  AccountBalances = "account-balances",
}

export enum Messages {
  PriceUpdated = "PRICES_UPDATED",
  CoinInfoUpdated = "COIN_INFO_UPDATED",
  AccountsBalanceUpdated = "ACCOUNTS_BALANCE_UPDATED",
}

export const chains = ["westend", "polkadot", "kusama"]
