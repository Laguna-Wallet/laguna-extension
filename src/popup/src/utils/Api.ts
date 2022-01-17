import axios from 'axios';

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

// export async function Token_Meta({ chain, value, from, quote }: PriceConverter) {
//   return await AXIOS_INSTANCE.post(
//     `
//       https://${chain}.api.subscan.io/api/scan/token`,
//     {
//       time: Date.now(),
//       value: 1000,
//       from: 'USD',
//       quote: 'DOT'
//     }
//   );
// }
