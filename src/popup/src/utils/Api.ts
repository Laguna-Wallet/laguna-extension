import axios from 'axios';
import { changeAccountsBalances, changeTokenReceived } from 'redux/actions';
import { AppDispatch } from 'redux/store';
import { checkBalanceChange, timer } from 'utils';
import { getFromStorage, saveToStorage } from './chrome';
import { recodeAddress } from './polkadot';
import { Messages, networks, StorageKeys } from './types';

interface PriceConverter {
  symbol: string;
  amount: string;
  fiat: string;
  chain: string;
}

const AXIOS_INSTANCE = axios.create({
  // headers: { 'X-API-Key': process.env.REACT_APP_SUBSCAN_API_KEY as string }
});

// TODO Refactor
export async function Account_Search(chain: string, address: string) {
  return await AXIOS_INSTANCE.post(`https://${chain}.api.subscan.io/api/v2/scan/search`, {
    key: address
  });
}
export async function Price_Converter({ chain, symbol, amount, fiat }: PriceConverter) {
  const data = await AXIOS_INSTANCE.get(
    `    https://api.coingecko.com/api/v3/simple/price?ids=${[
      'polkadot,kusama'
    ]}&vs_currencies=${fiat}`
  );

  return data;
}

// Todo Price Checkup
export async function getCoinInfo({ chains }: any) {
  const data = await AXIOS_INSTANCE.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${chains}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
  );

  return data;
}

// todo proper typing
export async function fetchAccountsBalances(
  // dispatch: AppDispatch
  dispatch: any
) {
  try {
    // await timer(3000)

    const account = await getFromStorage(StorageKeys.ActiveAccount);

    const balances = await getFromStorage(StorageKeys.AccountBalances);
    const parsedBalances = balances ? JSON.parse(balances) : {};

    if (account) {
      const address = JSON.parse(account as string).address;
      let result_obj: any = {};
      const temp_obj: Record<string, any> = {};

      let i = 0;

      while (i < networks.length) {
        await timer(1000);
        const network = networks[i];

        const resolved = await searchAccountBallance(
          network.chain,
          recodeAddress(address, network?.prefix, network?.encodeType)
        );

        // if (resolved.message !== "Success") return

        if (resolved.message !== 'Success') {
          if (resolved.message === 'Record Not Found') {
            i++;
          }
          continue;
        }

        temp_obj[network.chain] = {
          overall: Number(resolved.data.account.balance),
          locked: Number(resolved.data.account.balance_lock)
        };

        if (parsedBalances.address === address) {
          const accountBalances = parsedBalances?.balances;
          result_obj = { ...accountBalances, ...temp_obj };
        } else {
          result_obj = { ...temp_obj };
        }

        i++;
      }

      i = 0;

      const hasReceived: boolean = await checkBalanceChange(result_obj, address);
      console.log('~ hasReceived', hasReceived);

      saveToStorage({
        key: StorageKeys.AccountBalances,
        value: JSON.stringify({ address, balances: result_obj })
      });

      dispatch(changeAccountsBalances({ address, balances: result_obj }));

      if (hasReceived) {
        console.log('~ hasReceived', hasReceived);
        dispatch(changeTokenReceived({ tokenReceived: hasReceived }));
      }
    }

    setTimeout(() => fetchAccountsBalances(dispatch), 3000);
  } catch (err) {
    setTimeout(() => fetchAccountsBalances(dispatch), 5000);
    console.log('error while fetching balances:', err);
  }
}

async function searchAccountBallance(chain: string, address: string) {
  if (!chain) return;
  const res = await fetch(`https://${chain}.api.subscan.io/api/v2/scan/search`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.REACT_APP_SUBSCAN_KEY || ''
    },
    body: JSON.stringify({ key: address, row: 1, page: 1 })
  });

  return await res.json();
}
