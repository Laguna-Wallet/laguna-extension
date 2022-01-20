import { keyExtractSuri, mnemonicValidate, randomAsHex } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';
import { assert, isHex, u8aToString } from '@polkadot/util';
import { Asset, Network, SEED_LENGTHS, StorageKeys } from './types';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import keyring from '@polkadot/ui-keyring';
import { selectableNetworks } from '@polkadot/networks';
import { Account_Search, getCoinInfo, Price_Converter } from './Api';
import { getFromStorage } from './chrome';
import bcrypt from 'bcryptjs';
import { encryptPassword } from 'utils';
import { useAccount } from 'context/AccountContext';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util/format';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { MetadataDef } from '@polkadot/extension-inject/types';
import settings from '@polkadot/ui-settings';

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
export function seedValidate(suri: string, type?: KeypairType) {
  if (!suri) return false;

  const { phrase } = keyExtractSuri(suri);

  // if (!isHex(phrase, 256)) throw new Error('Hex seed needs to be 256-bits');

  if (!SEED_LENGTHS.includes(phrase.split(' ').length))
    throw new Error(`Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`);

  if (!mnemonicValidate(phrase)) throw new Error('Not a valid mnemonic seed');

  // todo revise with sam
  // todo move to separate function
  const password = '123123123';
  const account = keyring.addUri(suri);
  return account;
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

// todo proper typing
export async function getNetworks(): Promise<Network[]> {
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

  // todo typing
  const { data } = (await getCoinInfo({ chains: ['polkadot', 'kusama'] })) as any;

  // todo typing
  const ht = data.reduce((acc: any, item: any) => {
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
export async function getAssets(accountAddress: string): Promise<{
  overallBalance: number;
  assets: Asset[];
}> {
  const networks = await getNetworks();
  let overallBalance = 0;
  const assets: Asset[] = [];

  for (let i = 0; i < networks.length; i++) {
    try {
      const { name, symbol, chain, node } = networks[i];

      const api = await getApiInstance(chain);

      const { nonce, data: balance } = await api.query.system.account(accountAddress);

      const decimals = await api.registry.chainDecimals[0];

      const formattedBalance = formatBalance(
        balance.toJSON().free as number,
        { withSi: false, forceUnit: '-' },
        decimals
      );

      if (!Number(formattedBalance)) continue;

      // // Note fiat can become dynamic & grab info from storage.
      const { data } = await Price_Converter({
        chain,
        symbol,
        amount: String(Number(formattedBalance)),
        fiat: 'USD'
      });

      const price = data[chain]?.usd || 0;
      // const price = 0;
      const calculatedPrice = Number(formattedBalance) * price;

      if (price) {
        overallBalance += calculatedPrice;
      }

      assets.push({
        balance: formattedBalance,
        name,
        symbol,
        chain,
        calculatedPrice,
        price
      });
    } catch (err) {
      console.log('err', err);
    }
  }

  console.log('successfully fetched');

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
    `wss://${node}.api.onfinality.io/rpc?apikey=0dcf3660-e510-4df3-b9d2-bba6b16e3ae9`
  );

  return await ApiPromise.create({ provider: wsProvider });
}

export function isKeyringPairs$Json(
  json: KeyringPair$Json | KeyringPairs$Json
): json is KeyringPairs$Json {
  return json.encoding.content.includes('batch-pkcs8');
}

export function calculateSelectedTokenExchange(amount: string, price: number): number {
  return Number(amount) * Number(price);
}
