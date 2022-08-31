import { Network, TokenSymbols } from "../../utils/types";

export const substrateNetworks: Network[] = [
    {
      name: "Polkadot",
      symbol: TokenSymbols.westend,
      chain: "westend",
      node: "wss://westend-rpc.polkadot.io",
      prefix: 42,
    },
    {
      name: "Polkadot",
      symbol: TokenSymbols.polkadot,
      chain: "polkadot",
      node: "wss://rpc.polkadot.io",
      prefix: 0,
    },
    {
      name: "Kusama",
      symbol: TokenSymbols.kusama,
      chain: "kusama",
      node: "wss://kusama-rpc.polkadot.io",
      prefix: 2,
    },
    // {
    //   name: 'Moonriver',
    //   symbol: 'movr',
    //   chain: 'moonriver',
    //   node: 'wss://moonriver-rpc.polkadot.io',
    //   encodeType: 'ethereum'
    // },
    // {
    //   name: 'Moonbeam',
    //   symbol: 'glmr',
    //   chain: 'moonbeam',
    //   // chain: ' moonbeam-alpha',
    //   node: 'wss://moonbeam-rpc.polkadot.io',
    //   encodeType: 'ethereum'
    // },
    // {
    //   name: 'Shiden',
    //   symbol: 'sdn',
    //   chain: 'shiden',
    //   node: 'wss://shiden.api.onfinality.io/public-ws'
    // },
    // {
    //   name: 'Astar',
    //   symbol: TokenSymbols.astar,
    //   chain: 'astar',
    //   node: 'wss://astar.api.onfinality.io/public-ws',
    //   prefix: 5
    // }

    // wss://rpc.astar.network

    // {
    //   name: 'Acala',
    //   symbol: 'ACA',
    //   chain: 'acala-testnet' //todo revise test-net?
    // },
    // {
    //   name: 'Karura',
    //   symbol: 'KAR',
    //   chain: 'karura'
    // },
    // {
    //   name: 'Altair',
    //   symbol: 'AIR',
    //   chain: 'altair'
    // },

    // {
    //   name: 'Bifrost',
    //   symbol: 'BNC',
    //   chain: 'bifrost-parachain'
    // },
    // {
    //   name: 'Edgeware',
    //   symbol: 'EDG',
    //   chain: 'edgeware'
    // }
];
