import { timer } from 'utils';
import { chains, Transaction } from './types';

export async function fetchAccountsTransactions(address: string) {
  try {
    let result_arr: Transaction[] = [];
    let results = [];
    let retrieved_count = 0;
    let page = 0;
    //   let accountTransfers = [];

    for (let i = 0; i < chains.length; i++) {
      await timer(1000);

      const res = await fetchTransactions(address, chains[i], page);

      if (!res?.data?.transfers) continue;

      results = [...res?.data?.transfers];
      retrieved_count = res?.data?.count;
      page++;

      while (results.length < retrieved_count) {
        try {
          await timer(1000);
          const data = await fetchTransactions(address, chains[i], page);
          results = [...results, ...data?.data?.transfers];
          page++;
        } catch (err) {
          console.log('err', err);
        }
      }

      retrieved_count = 0;
      page = 0;

      result_arr = [...result_arr, ...transformTransfers(results, chains[i])];
    }

    return result_arr;
  } catch (err) {
    console.log('err', err);
    return [];
  }
}

export async function fetchTransactions(address: string, chain: string, page: number) {
  console.log('~ process.env.REACT_APP_SUBSCAN_KEY', process.env.REACT_APP_SUBSCAN_KEY);
  const res = await fetch(`https://${chain}.api.subscan.io/api/scan/transfers`, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.REACT_APP_SUBSCAN_KEY as string
    },
    body: JSON.stringify({ address, row: 30, page })
  });

  return await res.json();
}

export function transformTransfers(transfers: any[], chain: any): Transaction[] {
  return transfers.map((transfer) => ({
    chain,
    amount: transfer?.amount,
    fee: transfer?.fee,
    from: transfer?.from,
    to: transfer?.to,
    nonce: transfer?.nonce,
    hash: transfer?.hash,
    timestamp: transfer?.block_timestamp
  }));
}
