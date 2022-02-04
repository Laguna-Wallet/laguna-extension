import { createStore, Store } from 'redux';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import rootReducer from './reducer';

const prices = getFromStorage(StorageKeys.TokenPrices);
const infos = getFromStorage(StorageKeys.TokenInfos);
const accountsBalances = getFromStorage(StorageKeys.AccountBalances);
const transactions = getFromStorage(StorageKeys.Transactions);

const initialState: any = {
  wallet: {
    prices: prices ? JSON.parse(prices) : {},
    infos: infos ? JSON.parse(infos) : [],
    accountsBalances: accountsBalances ? JSON.parse(accountsBalances) : [],
    transactions: transactions ? JSON.parse(transactions) : []
  }
};

// todo inject redux dev tools
const store: Store<any, any> = createStore(
  rootReducer,
  initialState
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) as any;

export default store;
