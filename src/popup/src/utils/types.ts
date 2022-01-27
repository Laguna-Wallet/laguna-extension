import { KeypairType } from '@polkadot/util-crypto/types';

export enum SecurityOptionsEnum {
  Secured = 'Secured',
  None = 'None'
}

export type SecurityOptions = 'Secured' | 'None' | undefined;

export type MnemonicsTriple = [number, number, number];
export enum ImportTypeEnum {
  SEED = 'Seed',
  JSON = 'Json'
}
export type ImportType = ImportTypeEnum.SEED | ImportTypeEnum.JSON;

export const DEFAULT_TYPE: KeypairType = 'sr25519';
export const SEED_LENGTHS = [12, 24];

export enum StorageKeys {
  SignedIn = 'signed-in',
  Encoded = 'encoded',
  LoggedOut = 'logged-out',
  ActiveAccount = 'active-account',
  TokenPrices = 'token-prices',
  TokenInfos = 'token-infos'
}

//==============================================================================
// Polkadot
//==============================================================================
export interface Network {
  name: string;
  symbol: string;
  chain: string;
  node: string;
  price_change_percentage_24h?: number;
  marketCap?: number;
}

export interface Asset {
  name: string;
  symbol: string;
  chain: string;
  balance: string;
  calculatedPrice: number;
  price: number;
}

export type Prices = Record<string, Record<string, number>>;

//==============================================================================
// Messaging
//==============================================================================

export enum Messages {
  PriceUpdated = 'PRICES_UPDATED',
  CoinInfoUpdated = 'COIN_INFO_UPDATED'
}

//==============================================================================
// SHARED
//==============================================================================
export interface SelectType {
  value: string;
  name: string;
}
