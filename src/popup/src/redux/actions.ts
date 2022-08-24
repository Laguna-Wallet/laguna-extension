import { TokenData } from 'utils/evm/interfaces';
import { Asset, Token } from 'utils/types';

// send token
export function changeAddress(address: string) {
  return {
    type: 'CHANGE_ADDRESS',
    payload: { address }
  };
}

export function changeAmount(amount: string) {
  return {
    type: 'CHANGE_AMOUNT',
    payload: { amount }
  };
}

export function setBlockHash(blockHash: string) {
  return {
    type: 'SET_BLOCK_HASH',
    payload: { blockHash }
  };
}

export function selectAsset(selectedAsset: Asset) {
  return {
    type: 'SELECT_ASSET',
    payload: { selectedAsset }
  };
}

export function selectAssetToken(selectedAssetToken: string) {
  return {
    type: 'SELECT_ASSET_TOKEN',
    payload: { selectedAssetToken }
  };
}

// wallet
export function toggleLoading(loading: boolean) {
  return {
    type: 'TOGGLE_LOADING',
    payload: { loading }
  };
}

export function changePrices(prices: Record<string, number>) {
  return {
    type: 'CHANGE_PRICES',
    payload: { prices }
  };
}

export function changeInfo(infos: Record<string, number>) {
  return {
    type: 'CHANGE_INFOS',
    payload: { infos }
  };
}

export function changeAccountsBalances(accountsBalances: Record<string, number>) {
  return {
    type: 'CHANGE_ACCOUNTS_BALANCES',
    payload: { accountsBalances }
  };
}

export function changeEthereumBalances(ethereumBalances: TokenData) {
  return {
    type: 'CHANGE_ETHEREUM_BALANCES',
    payload: {ethereumBalances}
  }
}

export function changeTransactions(transactions: Record<string, number>) {
  return {
    type: 'CHANGE_TRANSACTIONS',
    payload: { transactions }
  };
}

export function changeIdleTimeout(idleTimeout: string) {
  return {
    type: 'CHANGE_IDLE_TIMEOUT',
    payload: { idleTimeout }
  };
}

export function changeIsLoggedIn(isLoggedIn: string) {
  return {
    type: 'CHANGE_IS_LOGGED_IN',
    payload: { isLoggedIn }
  };
}

export function changeTokenDecimals(tokenDecimals: Record<string, string>) {
  return {
    type: 'CHANGE_TOKEN_DECIMALS',
    payload: { tokenDecimals }
  };
}

export function changeDappAuthorization(pendingDappAuthorization: Record<string, string>) {
  return {
    type: 'CHANGE_DAPP_AUTHORIZATION',
    payload: { pendingDappAuthorization }
  };
}

export function changePendingToSign(pendingToSign: Record<string, string>) {
  return {
    type: 'CHANGE_PENDING_TO_SIGN',
    payload: { pendingToSign }
  };
}

export function changePendingToSignRaw(pendingToSignRaw: Record<string, string>) {
  return {
    type: 'CHANGE_PENDING_TO_SIGN_RAW',
    payload: { pendingToSignRaw }
  };
}

export function changeConnectedApps(connectedApps: Record<string, string>) {
  return {
    type: 'CHANGE_CONNECTED_APPS',
    payload: { connectedApps }
  };
}

export function changeTokenReceived({ tokenReceived }: { tokenReceived: boolean }) {
  return {
    type: 'TOKEN_RECEIVED',
    payload: { tokenReceived }
  };
}

export function changeDisabledTokens(disabledTokens: Token[]) {
  return {
    type: 'CHANGE_DISABLED_TOKENS',
    payload: { disabledTokens }
  };
}

