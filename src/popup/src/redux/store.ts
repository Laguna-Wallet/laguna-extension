import { storage } from 'googleapis/build/src/apis/storage';
import { createStore, Store } from 'redux';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
import { TokenData } from 'utils/evm/interfaces';
import { Prices, StorageKeys, Token } from 'utils/types';
import { string } from 'yup/lib/locale';
import rootReducer from './reducer';

export interface State {
  wallet: {
    tokenDecimals: Record<string, string>;
    loading: boolean;
    pendingToSign: Record<string, string>;
    pendingToSignRaw: Record<string, string>;
    connectedApps: [];
    pendingDappAuthorization: any;
    isLoggedIn: boolean | undefined;
    prices: Prices;
    infos: any[];
    accountsBalances: {
      address: string;
      balances: Record<string, { transferable: number; locked: number }>;
    },
    ethereumBalances: TokenData;
    transactions: any[];
    ethereumTransactions: Record<string, string>;
    idleTimeout: number;
    tokenReceived: boolean;
    disabledTokens: Token[];
    onboarding: boolean;
  };
}

async function handleInitialState(): Promise<State> {
  const prices = await getFromStorage(StorageKeys.TokenPrices);
  const infos = await getFromStorage(StorageKeys.TokenInfos);
  const accountsBalances = await getFromStorage(StorageKeys.AccountBalances);
  const ethereumBalances = await getFromStorage(StorageKeys.ethereumBalances)
  const transactions = await getFromStorage(StorageKeys.Transactions);
  const ethereumTransactions = await getFromStorage(StorageKeys.EthereumTransactions)
  const idleTimeout = await getFromStorage(StorageKeys.IdleTimeout);
  const tokenDecimals = await getFromStorage(StorageKeys.TokenDecimals);
  const pendingDappAuthorization: [] = [];
  const pendingToSign = {};
  const pendingToSignRaw = {};
  const connectedApps: [] = [];
  const disabledTokens = await getFromStorage(StorageKeys.DisabledTokens);
  const onboarding = await getFromStorage(StorageKeys.OnBoarding);

  return {
    // todo proper Typing of properties
    wallet: {
      tokenDecimals: tokenDecimals ? JSON.parse(tokenDecimals) : {},
      loading: false,
      pendingToSign,
      pendingToSignRaw,
      connectedApps,
      pendingDappAuthorization,
      isLoggedIn: undefined,
      prices: prices ? JSON.parse(prices) : {},
      infos: infos ? JSON.parse(infos) : [],
      accountsBalances: accountsBalances ? JSON.parse(accountsBalances) : [],
      ethereumBalances: ethereumBalances ? JSON.parse(ethereumBalances): [],
      transactions: transactions ? JSON.parse(transactions) : [],
      ethereumTransactions: ethereumTransactions ? JSON.parse(ethereumTransactions): [],
      idleTimeout: Number(idleTimeout) || 10,
      tokenReceived: false,
      disabledTokens: disabledTokens ? JSON.parse(disabledTokens) : [],
      onboarding: onboarding ? JSON.parse(onboarding) : false
    }
  };
}

async function generateStore(): Promise<Store<any, any>> {
  const initialState: State = await handleInitialState();

  const store: Store<any, any> = createStore(
    rootReducer,
    initialState
    // todo maybe inject redux dev tools
    //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ) as any;

  // store.subscribe(() => {
  //   // persist your state
  // });

  return store;
}

export default generateStore;

export type AppDispatch = (arg: State) => State;
