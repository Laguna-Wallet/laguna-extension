import { createStore, Store } from 'redux';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
import { Prices, StorageKeys, Token } from 'utils/types';
import { string } from 'yup/lib/locale';
import rootReducer from './reducer';

const prices = getFromStorage(StorageKeys.TokenPrices);
const infos = getFromStorage(StorageKeys.TokenInfos);
const accountsBalances = getFromStorage(StorageKeys.AccountBalances);
const transactions = getFromStorage(StorageKeys.Transactions);
const idleTimeout = getFromStorage(StorageKeys.IdleTimeout);
const tokenDecimals = getFromStorage(StorageKeys.TokenDecimals);
const pendingDappAuthorization: [] = [];
const pendingToSign = {};
const connectedApps: [] = [];
const disabledTokens = getFromStorage(StorageKeys.DisabledTokens);
const onboarding = getFromStorage(StorageKeys.OnBoarding);
const boardedAccounts = getFromStorage(StorageKeys.OnBoarding);

// todo proper Typing of properties
export interface State {
  wallet: {
    tokenDecimals: Record<string, string>;
    loading: boolean;
    pendingToSign: Record<string, string>;
    connectedApps: [];
    pendingDappAuthorization: any;
    isLoggedIn: boolean | undefined;
    prices: Prices;
    infos: any[];
    accountsBalances: any;
    transactions: any[];
    idleTimeout: number;
    tokenReceived: boolean;
    disabledTokens: Token[];
    onboarding: boolean;
    boardedAccounts: Record<string, boolean>;
  };
}

const initialState: State = {
  wallet: {
    tokenDecimals: tokenDecimals ? JSON.parse(tokenDecimals) : {},
    loading: false,
    pendingToSign,
    connectedApps,
    pendingDappAuthorization,
    isLoggedIn: undefined,
    prices: prices ? JSON.parse(prices) : {},
    infos: infos ? JSON.parse(infos) : [],
    accountsBalances: accountsBalances ? JSON.parse(accountsBalances) : [],
    transactions: transactions ? JSON.parse(transactions) : [],
    idleTimeout: Number(idleTimeout) || 10,
    tokenReceived: false,
    disabledTokens: disabledTokens ? JSON.parse(disabledTokens) : [],
    onboarding: onboarding ? JSON.parse(onboarding) : false,
    boardedAccounts: boardedAccounts ? JSON.parse(boardedAccounts) : {}
  }
};

// todo maybe inject redux dev tools
const store: Store<any, any> = createStore(
  rootReducer,
  initialState
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) as any;

store.subscribe(() => {
  // persist your state
});

export default store;
