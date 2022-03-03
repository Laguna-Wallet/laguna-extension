import { KeypairType } from '@polkadot/util-crypto/types';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { ProviderInterface } from '@polkadot/rpc-provider/types';

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

export const DEFAULT_TYPE: KeypairType = 'ed25519';
export const SEED_LENGTHS = [12, 24];

export enum StorageKeys {
  SignedIn = 'signed-in',
  Encoded = 'encoded',
  LoggedOut = 'logged-out',
  ActiveAccount = 'active-account',
  TokenPrices = 'token-prices',
  TokenInfos = 'token-infos',
  AccountBalances = 'account-balances',
  Transactions = 'transactions',
  IdleTimeout = 'idle-timeout',
  UnlockedPairs = 'unlocked-pairs',
  TokenDecimals = 'token-decimals'
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
  encodeType?: string;
}

export interface Asset {
  name: string;
  symbol: string;
  chain: string;
  balance: string;
  calculatedPrice: number;
  price: number;
  encodeType?: string;
}

export type Prices = Record<string, Record<string, number>>;

//==============================================================================
// Messaging
//==============================================================================

export enum Messages {
  PriceUpdated = 'PRICES_UPDATED',
  CoinInfoUpdated = 'COIN_INFO_UPDATED',
  AccountsBalanceUpdated = 'ACCOUNTS_BALANCE_UPDATED',
  TransactionsUpdated = 'TRANSACTIONS_UPDATED',
  AuthCheck = 'AUTH_CHECK',
  AuthUser = 'AUTH_USER',
  LogOutUser = 'LOG_OUT_USER',
  TokenDecimalsUpdated = 'TOKEN_DECIMALS_UPDATED',
  ChangeInterval = 'CHANGE_INTERVAL',
  SendTransaction = 'SEND_TRANSACTION',
  TransactionSuccess = 'TRANSACTION_SUCCESS',
  ReopenKeyPairs = 'REOPEN_KEYPAIRS',
  AddToKeyring = 'ADD_TO_KEYRING',
  RemoveFromKeyring = 'REMOVE_FROM_KEYRING'
}

//==============================================================================
// SHARED
//==============================================================================
export interface SelectType {
  value: string;
  name: string;
}

export enum TokenSymbols {
  westend = 'wnd',
  polkadot = 'dot',
  kusama = 'ksm',
  moonriver = 'movr',
  moonbeam = 'glmr',
  shiden = 'sdn',
  astar = 'astr'
}

// todo move chain names to enum
export interface Transaction {
  chain: 'westend' | 'polkadot' | 'kusama' | 'moonriver' | 'moonbeam' | 'shiden' | 'astar';
  amount: string;
  fee: string;
  from: string;
  to: string;
  nonce: string;
  hash: string;
  timestamp: string;
}

//==============================================================================
// Inject
//==============================================================================

export interface InjectedAccount {
  address: string;
  genesisHash?: string | null;
  name?: string;
  type?: KeypairType;
}

export type Unsubcall = () => void;

export interface InjectedAccounts {
  get: (anyType?: boolean) => Promise<InjectedAccount[]>;
  subscribe: (cb: (accounts: InjectedAccount[]) => void | Promise<void>) => Unsubcall;
}

export interface InjectedMetadataKnown {
  genesisHash: string;
  specVersion: number;
}

export interface MetadataDefBase {
  chain: string;
  genesisHash: string;
  icon: string;
  ss58Format: number;
  chainType?: 'substrate' | 'ethereum';
}

export interface MetadataDef extends MetadataDefBase {
  color?: string;
  specVersion: number;
  tokenDecimals: number;
  tokenSymbol: string;
  types: Record<string, Record<string, string> | string>;
  metaCalls?: string;
  userExtensions?: ExtDef;
}

export interface InjectedMetadata {
  get: () => Promise<InjectedMetadataKnown[]>;
  provide: (definition: MetadataDef) => Promise<boolean>;
}

export interface ProviderMeta {
  // Network of the provider
  network: string;
  // Light or full node
  node: 'full' | 'light';
  // The extension source
  source: string;
  // Provider transport: 'WsProvider' etc.
  transport: string;
}

export type ProviderList = Record<string, ProviderMeta>;

export interface InjectedProvider extends ProviderInterface {
  listProviders: () => Promise<ProviderList>;
  startProvider: (key: string) => Promise<ProviderMeta>;
}

export interface Injected {
  accounts: InjectedAccounts;
  metadata?: InjectedMetadata;
  provider?: InjectedProvider;
  signer: InjectedSigner;
}

export const chains = ['westend', 'polkadot', 'kusama', 'moonriver', 'moonbeam', 'shiden', 'astar'];
