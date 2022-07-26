import { assert, hexToU8a, u8aToHex, isHex, u8aToString } from '@polkadot/util';
import {
  keyExtractSuri,
  mnemonicValidate,
  randomAsHex,
  mnemonicToMiniSecret,
  encodeAddress as toSS58,
  ethereumEncode
} from '@polkadot/util-crypto';

import {
  Asset,
  Network,
  Prices,
  SEED_LENGTHS,
  StorageKeys,
  Token,
  TokenSymbols,
  Transaction
} from './types';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import keyring from '@polkadot/ui-keyring';
import { getFromStorage } from './chrome';
import bcrypt from 'bcryptjs';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import BigNumber from 'bignumber.js';
import * as AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { fetchTransactions, transformTransfers } from './fetchTransactions';
import { generateRandomBase64Avatar } from 'utils';

// TODO appropriate typing

//==============================================================================
// Accounts & Addresses
//==============================================================================
export function generateKeyPair(
  password: string,
  mnemonics?: string,
  name?: 'default name'
): { pair: any; json: any } {
  if (mnemonics) {
    return keyring.addUri(mnemonics, password, { name: 'mnemonic acc' });
  }

  return keyring.addUri(randomAsHex(32), password, { name: 'mnemonic acc' });
}

export async function validatePassword(password: string) {
  const hashed = await getFromStorage(StorageKeys.Encoded);

  if (!hashed) return false;
  return bcrypt.compareSync(password, hashed as string);
}

export function getAddresses() {
  return keyring.getAddresses();
}

export function getAccounts() {
  return keyring.getAccounts();
}

export function validateSeed(suri: string) {
  try {
    if (!suri) return;

    const { phrase } = keyExtractSuri(suri);

    if (isHex(phrase)) {
      assert(isHex(phrase, 256), 'Hex seed needs to be 256-bits');
    } else {
      assert(SEED_LENGTHS.includes(phrase.split(' ').length), `Please enter 12 or 14 words`);

      assert(mnemonicValidate(phrase), 'Not a valid mnemonic seed');
    }

    return true;
  } catch (err) {
    console.log(err);
  }
}

// todo alter this function to createAccountFromSeed
// todo maybe not needed
export function importViaSeed(suri: string, password: string) {
  if (!suri) return;

  const { phrase } = keyExtractSuri(suri);

  // if (!isHex(phrase, 256)) throw new Error('Hex seed needs to be 256-bits');

  if (!SEED_LENGTHS.includes(phrase.split(' ').length))
    throw new Error(`Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`);

  if (!mnemonicValidate(phrase)) throw new Error('Not a valid mnemonic seed');

  // todo revise with sam
  // todo move to separate function
  return keyring.addUri(suri, password, {}, 'ed25519');
}

// Imports
export async function importFromMnemonic(seed: string, password: string) {
  const key = mnemonicToMiniSecret(seed);
  const encodedKey = AES.encrypt(u8aToHex(key), password).toString();
  const encodedSeed = AES.encrypt(seed, password).toString();
  const { pair } = keyring.addUri(seed, password);

  const img = await generateRandomBase64Avatar();
  const newPair = addAccountMeta(pair.address, {
    encodedKey,
    encodedSeed,
    name: pair.address,
    img
  });

  newPair.setMeta({ encodedKey, encodedSeed, name: pair.address, img });

  return newPair;
}

export function importFromPrivateKey(secretKey: string, password: string) {
  const encodedKey = AES.encrypt(secretKey, password).toString();
  const { pair } = keyring.addUri(secretKey, password);
  keyring.saveAccountMeta(pair, { encodedKey, name: pair.address });
}

export function importFromPublicKey(publicAddress: string) {
  keyring.saveAddress(publicAddress, { name: publicAddress, viewOnly: true });
}

// todo proper typing for string
export function isValidPolkadotAddress(address: string): boolean {
  try {
    if (!address) return false;

    if (isHex(address) && hexToU8a(address)) {
      return true;
    }

    if (decodeAddress(address)) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

export function addressExists(address: string): boolean {
  const addresses = keyring.getAddresses();
  const filtered = addresses.filter((item) => item.address === address);
  if (filtered.length > 0) return true;

  return false;
}

export async function exportAll(password: string) {
  const addresses = keyring.getAccounts().map((account) => account.address);
  return await keyring.backupAccounts(addresses, password);
}

export async function exportAccount(address: string, password: string) {
  return keyring.backupAccount(keyring.getPair(address), password);
}

export async function importJson(
  json: KeyringPair$Json | KeyringPairs$Json | undefined,
  password: string
) {
  if (!json) return;
  if (isKeyringPairs$Json(json)) {
    const data = keyring.restoreAccounts(json, password);
    return json;
  } else {
    const pair = keyring.restoreAccount(json, password);
    return pair;
  }
}

// todo proper typing
export function accountsTie({ address, genesisHash }: any): any {
  const pair = keyring.getPair(address);
  keyring.saveAccountMeta(pair, { ...pair.meta, genesisHash });
  return keyring.getPair(address);
}

export function changeAccountPicture(address: string, obj: Record<string, any>): any {
  const pair = keyring.getPair(address);
  const { img, ...oldMeta } = pair.meta;
  keyring.saveAccountMeta(pair, { ...oldMeta, ...obj });
  const newPair = keyring.getPair(address);
  return newPair;
}

export function addAccountMeta(address: string, obj: Record<string, any>): any {
  const pair = keyring.getPair(address);
  keyring.saveAccountMeta(pair, { ...pair.meta, ...obj });
  const newPair = keyring.getPair(address);
  newPair.setMeta({ ...pair.meta, ...obj });
  return newPair;
}

// todo proper typing
export function getNetworks(
  prices: Prices,
  tokenInfos: Network[],
  disabledTokens?: Token[]
): Network[] {
  if (!prices || !tokenInfos) return [];

  const networks: Network[] = [
    {
      name: 'Polkadot',
      symbol: TokenSymbols.westend,
      chain: 'westend',
      node: 'wss://westend-rpc.polkadot.io',
      prefix: 42
    },
    {
      name: 'Polkadot',
      symbol: TokenSymbols.polkadot,
      chain: 'polkadot',
      node: 'wss://rpc.polkadot.io',
      prefix: 0
    },
    {
      name: 'Kusama',
      symbol: TokenSymbols.kusama,
      chain: 'kusama',
      node: 'wss://kusama-rpc.polkadot.io',
      prefix: 2
    }
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

  const ht = tokenInfos.reduce((acc: any, item: any) => {
    acc[item.symbol] = item;
    return acc;
  }, {});

  // todo typing

  const filteredNetworks = disabledTokens
    ? networks.filter((network) => !disabledTokens.includes(network.symbol))
    : networks;

  const enhancedNetworks: Network[] = filteredNetworks.map((network) => {
    if (!ht[network.symbol]) {
      return network;
    }

    return {
      ...network,
      price_change_percentage_24h: ht[network.symbol].price_change_percentage_24h as number,
      marketCap: ht[network.symbol].market_cap as number
    };
  });

  return enhancedNetworks;
}

// Todo refactor
// Todo Appropriate Typing
export async function getAssets(
  prices: Prices,
  tokenInfos: Network[],
  balances: any,
  disabledTokens: Token[],
  showZeroBalanceAssets?: boolean
): Promise<
  | {
      overallBalance: number;
      overallPriceChange: number;
      assets: Asset[];
    }
  | []
> {
  if (!balances) return [];
  const networks: Network[] = getNetworks(prices, tokenInfos, disabledTokens);

  const assets: Asset[] = [];

  let overallPriceChange = 0;
  let overallBalance = 0;

  for (let i = 0; i < networks.length; i++) {
    try {
      const { name, symbol, chain, node, encodeType, prefix, price_change_percentage_24h } =
        networks[i];

      let balance = balances[chain];

      if (!balance && !showZeroBalanceAssets) continue;

      if (showZeroBalanceAssets) {
        balance = !balance ? 0 : balance;
      }
      const price = prices[chain]?.usd;

      // todo rename calculatedBalance
      const calculatedPrice = new BigNumber(balance.overall).multipliedBy(price || 0);

      if (price) {
        overallBalance += calculatedPrice.toNumber();
        overallPriceChange += Number(price_change_percentage_24h);
      }

      assets.push({
        balance,
        name,
        symbol,
        chain,
        calculatedPrice: calculatedPrice.toNumber(),
        price,
        prefix,
        encodeType
      });
    } catch (err) {
      console.log(err);
    }
  }

  return { overallBalance, assets, overallPriceChange };
}

// todo proper typing
// todo refactor
export function recodeAddress(address: string, prefix: any, type?: string): string {
  if (type === 'ethereum') {
    const raw = decodeAddress(address);
    return ethereumEncode(raw);
  }

  const raw = decodeAddress(address);
  return encodeAddress(raw, prefix);
}

export function recodeAddressForTransaction(address: string, prefix: any) {
  const raw = decodeAddress(address);
  return encodeAddress(raw, prefix);
}

// todo typing node is an enum
export async function getApiInstance(node: string) {
  // todo put this into env
  const wsProvider = new WsProvider(
    `wss://${node}.api.onfinality.io/ws?apikey=${process.env.REACT_APP_ONFINALITY_KEY}`
  );

  return await ApiPromise.create({ provider: wsProvider });
}

export function isKeyringPairs$Json(
  json: KeyringPair$Json | KeyringPairs$Json
): json is KeyringPairs$Json {
  return json?.encoding?.content?.includes('batch-pkcs8');
}

export function isKeyringJson(
  json: KeyringPair$Json | KeyringPairs$Json
): json is KeyringPair$Json {
  try {
    if (isKeyringPairs$Json(json)) return false;

    const { address } = keyring.createFromJson(json);

    return !!address;
  } catch (e) {
    return false;
  }
}

export async function isValidKeyringPassword(
  json: KeyringPair$Json | KeyringPairs$Json,
  password: string
): Promise<boolean> {
  try {
    // yet this is the only way found
    // to check if password is valid, for batch json file
    if (isKeyringPairs$Json(json)) {
      // if password if wrong function will throw error
      keyring.restoreAccounts(json, password);
      // in this function we wan't to check if password is valid
      // without storing accounts,
      json.accounts.map(({ address }) => {
        keyring.forgetAccount(address);
      });
      return true;
    } else {
      const newPair = keyring.createFromJson(json);
      newPair.unlock(password);
      if (!newPair.isLocked) {
        keyring.forgetAccount(newPair.address);
        return true;
      }
    }

    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export function encryptKeyringPairs(oldPassword: string, newPassword: string) {
  const pairs = keyring.getPairs();

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    pair.unlock(oldPassword);

    keyring.forgetAccount(pair.address);
    const { pair: newPair } = keyring.addPair(pair, newPassword);

    newPair.setMeta(pair.meta);
    keyring.saveAccountMeta(newPair, { ...pair.meta });
  }
}

// todo typing keyringPair
export async function encryptKeyringPair(pair: any, oldPassword: string, newPassword: string) {
  pair.unlock(oldPassword);
  const { pair: newPair } = keyring.addPair(pair, newPassword);
  const img = await generateRandomBase64Avatar();
  const enhancedPair = addAccountMeta(newPair.address, { img, ...pair.meta });
  return enhancedPair;
}

export function encryptMetaData(oldPassword: string, newPassword: string) {
  const pairs = keyring.getPairs();

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const meta = pair.meta;

    // decode key and encode with new password
    // if (meta?.encodedKey) {
    //   const decodedKeyBytes = AES.decrypt(meta?.encodedKey as string, oldPassword);
    //   const decodedKey = decodedKeyBytes.toString(Utf8);

    //   const reEncodedKey = AES.encrypt(decodedKey, newPassword).toString();

    //   pair.setMeta({ ...pair.meta, encodedKey: reEncodedKey });
    //   keyring.saveAccountMeta(pair, { ...pair.meta, encodedKey: reEncodedKey });
    // }

    // decode seed and encode with new password
    if (meta?.encodedSeed) {
      const decodedSeedBytes = AES.decrypt(meta?.encodedSeed as string, oldPassword);
      const decodedSeed = decodedSeedBytes.toString(Utf8);

      const reEncodedSeed = AES.encrypt(decodedSeed, newPassword).toString();

      keyring.saveAccountMeta(pair, { ...pair.meta, encodedSeed: reEncodedSeed });
      pair.setMeta({ ...pair.meta, encodedSeed: reEncodedSeed });
    }
  }
}

export function accountsChangePassword(address: string, oldPass: string, newPass: string) {
  const pair = keyring.getPair(address);

  pair.decodePkcs8(oldPass);

  keyring.encryptAccount(pair, newPass);
  return pair;
}

export async function getLatestTransactionsForSingleChain(
  address: string,
  chain: string,
  page: number,
  row: number
): Promise<{ count: number; transactions: Transaction[] }> {
  const data = await fetchTransactions(address, chain, row, page);
  return {
    count: data?.data?.count,
    transactions: data?.data?.transfers ? transformTransfers(data?.data?.transfers, chain) : []
  };
}

// todo pair proper typing
// export function unlockAndSavePair(pair: any, password: string) {
//   try {
//     const json = pair.toJson(password);

//     let newPairs = [];

//     const unlockedPairs = getFromStorage(StorageKeys.UnlockedPairs);

//     if (unlockedPairs) {
//       const parsed = JSON.parse(unlockedPairs);
//       newPairs = [...parsed, json];
//     } else {
//       newPairs = [json];
//     }

//     saveToStorage({ key: StorageKeys.UnlockedPairs, value: JSON.stringify(newPairs) });
//   } catch (error) {
//     throw new Error(error as string);
//   }
// }
