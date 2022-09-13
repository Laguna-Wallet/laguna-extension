import { timer } from "utils";
import { getEVMTransactions } from "./evm/api";
import { EVMNetwork } from "networks/evm";
import { chains, Transaction } from "./types";

// export async function fetchAllAccountsTransactions(address: string) {
//   try {
//     let result_arr: Transaction[] = [];
//     let results = [];
//     let retrieved_count = 0;
//     let page = 0;
//     //   let accountTransfers = [];

//     for (let i = 0; i < chains.length; i++) {
//       await timer(1000);

//       const res = await fetchTransactions(address, chains[i], 30, page);

//       if (!res?.data?.transfers) continue;

//       results = [...res.data.transfers];
//       retrieved_count = res?.data?.count;
//       page++;

//       while (results.length < retrieved_count) {
//         try {
//           await timer(1000);
//           const data = await fetchTransactions(address, chains[i], 30, page);
//           results = [...results, ...data.data.transfers];
//           page++;
//         } catch (err) {
//           console.log(err);
//         }
//       }

//       retrieved_count = 0;
//       page = 0;

//       result_arr = [...result_arr, ...transformTransfers(results, chains[i])];
//     }

//     return result_arr;
//   } catch (err) {
//     console.log(err);
//   }
// }

export async function fetchAccountTransactionsByChain(
  address: string,
  chain: string,
  token: string,
) {
  try {
    let result_arr: Transaction[] = [];
    let results = [];
    let retrieved_count = 0;
    let page = 0;
    //   let accountTransfers = [];
    console.log("hi");
    if (chain === EVMNetwork.ETHEREUM) {
      const data = await getEVMTransactions(address, EVMNetwork.ETHEREUM);
    }

    if (chain === EVMNetwork.AVALANCHE_TESTNET_FUJI) {
      const data = await getEVMTransactions(address, EVMNetwork.AVALANCHE_TESTNET_FUJI);
    }

    const res = await fetchTransactions(address, chain, token, 30, page);

    // if (!res?.data?.transfers) continue;
    if (!res?.data?.transfers) return;

    results = [...res.data.transfers];
    retrieved_count = res?.data?.count;
    page++;

    while (results?.length < retrieved_count) {
      try {
        await timer(1000);
        const data = await fetchTransactions(address, chain, token, 30, page);
        results = [...results, ...data.data.transfers];
        page++;
      } catch (err) {
        console.log(err);
      }
    }

    retrieved_count = 0;
    page = 0;

    result_arr = [...result_arr, ...transformTransfers(results, chain)];

    return result_arr;
  } catch (err) {
    console.log(err);
  }
}

export async function fetchTransactions(
  address: string,
  chain: string,
  token: string,
  row: number,
  page: number,
) {
  const res = await fetch(`https://${chain}.api.subscan.io/api/scan/transfers`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY as string,
    },
    body: JSON.stringify({ address, row: 30, page }),
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
    timestamp: transfer?.block_timestamp,
  }));
}
