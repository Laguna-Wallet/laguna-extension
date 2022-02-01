import { changeAccountsBalances, changeInfo, changePrices } from 'redux/actions';
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
    default:
      return;
  }
}

function updatePrice(message: PriceUpdateMessage, dispatch: any) {
  dispatch(changePrices(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.TokenPrices, value: message.payload });
}

function updateCoinInfo(message: PriceUpdateMessage, dispatch: any) {
  dispatch(changeInfo(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.TokenInfos, value: message.payload });
}

function updateAccountsBalances(message: PriceUpdateMessage, dispatch: any) {
  dispatch(changeAccountsBalances(JSON.parse(message.payload)));
  saveToStorage({ key: StorageKeys.AccountBalances, value: message.payload });
}
