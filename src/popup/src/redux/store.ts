import { createStore, Store } from 'redux';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
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
      polkodot: {
      address: string;
      balances: Record<string, { transferable: number; locked: number }>;
      };
      ethereum: {
        contractAddress: string;
        name: string;
        balance: string;
      };
    };
    transactions: any[];
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
  const transactions = await getFromStorage(StorageKeys.Transactions);
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
      transactions: transactions ? JSON.parse(transactions) : [],
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
