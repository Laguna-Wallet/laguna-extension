import { keyExtractSuri, mnemonicValidate, randomAsHex } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';
import { assert, hexToU8a, isHex, u8aToString } from '@polkadot/util';
import { Asset, Network, Prices, SEED_LENGTHS, StorageKeys } from './types';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import keyring from '@polkadot/ui-keyring';
import { selectableNetworks } from '@polkadot/networks';
import { Account_Search, getCoinInfo, Price_Converter } from './Api';
import { getFromStorage, saveToStorage } from './chrome';
import bcrypt from 'bcryptjs';
import { encryptPassword } from 'utils';
import { useAccount } from 'context/AccountContext';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util/format';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { MetadataDef } from '@polkadot/extension-inject/types';
import settings from '@polkadot/ui-settings';
import BigNumber from 'bignumber.js';

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

export function validatePassword(password: string) {
  const hashed = getFromStorage(StorageKeys.Encoded);

  if (!hashed) return false;
  return bcrypt.compareSync(password, hashed);
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
      assert(
        SEED_LENGTHS.includes(phrase.split(' ').length),
        `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`
      );

      assert(mnemonicValidate(phrase), 'Not a valid mnemonic seed');
    }

    return true;
  } catch (err) {
    console.log('err', err);
    return false;
  }
}

// todo alter this function to createAccountFromSeed
export function importViaSeed(suri: string, password: string) {
  if (!suri) return false;

  const { phrase } = keyExtractSuri(suri);

  // if (!isHex(phrase, 256)) throw new Error('Hex seed needs to be 256-bits');

  if (!SEED_LENGTHS.includes(phrase.split(' ').length))
    throw new Error(`Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`);

  if (!mnemonicValidate(phrase)) throw new Error('Not a valid mnemonic seed');

  // todo revise with sam
  // todo move to separate function
  const account = keyring.addUri(suri, password);
  return account;
}

// todo proper typing for string
export function isValidAddressPolkadotAddress(address: string): boolean {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));
    return true;
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
    return keyring.restoreAccounts(json, password);
  } else {
    return keyring.restoreAccount(json, password);
  }
}

// todo proper typing
export function accountsTie({ address, genesisHash }: any): any {
  const pair = keyring.getPair(address);
  keyring.saveAccountMeta(pair, { ...pair.meta, genesisHash });
  return keyring.getPair(address);
}

export function addAccountMeta(address: string, obj: Record<string, any>): any {
  const pair = keyring.getPair(address);
  keyring.saveAccountMeta(pair, { ...pair.meta, ...obj });
  const newPair = keyring.getPair(address);
  return newPair;
}

// todo proper typing
export function getNetworks(prices: Prices, tokenInfos: Network[]): Network[] {
  if (!prices || !tokenInfos) return [];

  const networks: Network[] = [
    {
      name: 'Polkadot',
      symbol: 'wnd',
      chain: 'westend',
      node: 'wss://westend-rpc.polkadot.io'
    },
    {
      name: 'Polkadot',
      symbol: 'dot',
      chain: 'polkadot',
      node: 'wss://rpc.polkadot.io'
    },
    {
      name: 'Kusama',
      symbol: 'ksm',
      chain: 'kusama',
      node: 'wss://kusama-rpc.polkadot.io'
    }
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
    //   name: 'Moonbeam',
    //   symbol: 'GLMR',
    //   chain: ' moonbeam-alpha'
    // },
    // {
    //   name: 'Moonriver',
    //   symbol: 'MOVR',
    //   chain: 'moonriver'
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
  const enhancedNetworks: Network[] = networks.map((network) => {
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
  balances: any
): Promise<
  | {
      overallBalance: number;
      assets: Asset[];
    }
  | []
> {
  if (!balances) return [];

  const networks = getNetworks(prices, tokenInfos);

  let overallBalance = 0;
  const assets: Asset[] = [];

  for (let i = 0; i < networks.length; i++) {
    try {
      const { name, symbol, chain, node } = networks[i];

      const balance = balances?.balances[chain];

      if (!balance) continue;

      const price = prices[chain]?.usd;

      // todo rename calculatedBalance
      const calculatedPrice = new BigNumber(balance).multipliedBy(price || 0);

      if (price) {
        overallBalance += calculatedPrice.toNumber();
      }

      assets.push({
        balance,
        name,
        symbol,
        chain,
        calculatedPrice: calculatedPrice.toNumber(),
        price
      });
    } catch (err) {
      console.log('err', err);
    }
  }

  return { overallBalance, assets };
}

// todo proper typing
// todo refactor
export function recodeAddress(address: string, prefix: any): string {
  const publicKey = decodeAddress(address);
  return encodeAddress(publicKey, prefix);
}

// todo typing node is an enum
export async function getApiInstance(node: string) {
  // API_KEY = 0dcf3660-e510-4df3-b9d2-bba6b16e3ae9
  //CHAIN.api.onfinality.io/ws?apikey=API_KEY

  // todo put this into env
  const wsProvider = new WsProvider(
    `wss://${node}.api.onfinality.io/ws?apikey=0dcf3660-e510-4df3-b9d2-bba6b16e3ae9`
  );

  return await ApiPromise.create({ provider: wsProvider });
}

export function isKeyringPairs$Json(
  json: KeyringPair$Json | KeyringPairs$Json
): json is KeyringPairs$Json {
  return json.encoding.content.includes('batch-pkcs8');
}

export function isKeyringJson(json: KeyringPair$Json): json is KeyringPair$Json {
  try {
    const {
      address,
      meta: { genesisHash, name },
      type
    } = keyring.createFromJson(json);

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
      if (!newPair.isLocked) return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}
