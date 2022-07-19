import {
  changeAccountsBalances,
  changeInfo,
  changePrices,
  changeTransactions,
  toggleLoading,
  changeDappAuthorization,
  changePendingToSign,
  changeConnectedApps,
  changeTokenReceived,
  changePendingToSignRaw
} from 'redux/actions';
import { accountHasChanged } from 'utils';
import { saveToStorage } from './chrome';
import { Messages, StorageKeys } from './types';

interface PriceUpdateMessage {
  type: string;
  payload: string;
}

type Message = PriceUpdateMessage;

// todo proper typing of dispatch
export function MessageListener(message: Message, dispatch: any) {
  switch (message.type) {
    case Messages.PriceUpdated:
      updatePrice(message, dispatch);
      break;
    case Messages.CoinInfoUpdated:
      updateCoinInfo(message, dispatch);
      break;
    case Messages.AccountsBalanceUpdated:
      updateAccountsBalances(message, dispatch);
      break;
    case Messages.TransactionsUpdated:
      updateTransactions(message, dispatch);
      break;
    case Messages.DappAuthorization:
      updateDappAuthorizationRequest(message, dispatch);
      break;
    case Messages.CheckPendingSign:
      updatePendingToSign(message, dispatch);
      break;
    case Messages.CheckPendingSignRaw:
      updatePendingToSignRaw(message, dispatch);
      break;

    case Messages.ConnectedApps:
      updateConnectedApps(message, dispatch);
      break;
    case Messages.TokenReceived:
      updateTokenReceived(message, dispatch);
      break;
    default:
      return;
  }
}

// todo add appropriate typings
function updatePrice(message: PriceUpdateMessage, dispatch: any) {
  dispatch(changePrices(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.TokenPrices, value: message.payload });
}

function updateCoinInfo(message: any, dispatch: any) {
  dispatch(changeInfo(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.TokenInfos, value: message.payload });
}

export async function updateAccountsBalances(message: any, dispatch: any) {
  dispatch(changeAccountsBalances(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.AccountBalances, value: message.payload });

  // if account address has changed, background has fetched
  // new balances and loading is finished
  if (await accountHasChanged(JSON.parse(message.payload))) {
    dispatch(toggleLoading(false));
  }
}

function updateTransactions(message: any, dispatch: any) {
  dispatch(changeTransactions(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.Transactions, value: message.payload });
}

function updateDappAuthorizationRequest(message: any, dispatch: any) {
  dispatch(changeDappAuthorization(message.payload));
}

function updatePendingToSign(message: any, dispatch: any) {
  dispatch(changePendingToSign(message.payload));
}

function updatePendingToSignRaw(message: any, dispatch: any) {
  dispatch(changePendingToSignRaw(message.payload));
}

function updateConnectedApps(message: any, dispatch: any) {
  dispatch(changeConnectedApps(message.payload));
}

function updateTokenReceived(message: any, dispatch: any) {
  dispatch(changeTokenReceived(JSON.parse(message.payload)));
}
