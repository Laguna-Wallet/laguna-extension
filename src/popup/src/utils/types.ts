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
  ActiveAccount = 'active-account',
  TokenPrices = 'token-prices',
  TokenInfos = 'token-infos',
  AccountBalances = 'account-balances',
  Transactions = 'transactions',
  IdleTimeout = 'idle-timeout',
  UnlockedPairs = 'unlocked-pairs',
  TokenDecimals = 'token-decimals',
  DisabledTokens = 'disabled-tokens',
  OnBoarding = 'onboarding'
}

//==============================================================================
// Polkadot
//==============================================================================
export interface Network {
  name: string;
  symbol: Token;
  chain: string;
  node: string;
  price_change_percentage_24h?: number;
  marketCap?: number;
  encodeType?: string;
  prefix: number;
}

export interface Asset {
  name: string;
  symbol: string;
  chain: string;
  balance?: number;
  calculatedPrice: number;
  price?: number;
  encodeType?: string;
  assetsCount?: number;
  marketCap?: number;
}

export type Prices = Record<string, Record<string, number>>;

export enum Prefixes {
  westend = 42,
  polkadot = 0,
  kusama = 2,
  moonriver = 1285,
  moonbeam = 1284,
  shiden = 5,
  astar = 5
}

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
  ForgotPassword = 'FORGOT_PASSWORD',
  ReopenKeyPairs = 'REOPEN_KEYPAIRS',
  AddToKeyring = 'ADD_TO_KEYRING',
  RemoveFromKeyring = 'REMOVE_FROM_KEYRING',
  ReEncryptPairs = 'RE_ENCRYPT_PAIRS',
  DappAuthorization = 'DAPP_AUTHORIZATION',
  CheckPendingDappAuth = 'CHECK_PENDING_DAPP_AUTH',
  CheckPendingSign = 'CHECK_PENDING_SIGN',
  SignRequest = 'SIGN_REQUEST',
  DappAuthRequest = 'DAPP_AUTH_REQUEST',
  ConnectedApps = 'CONNECTED_APPS',
  RevokeDapp = 'REVOKE_DAPP',
  TokenReceived = 'TOKEN_RECEIVED',
  Timeout = 'TIMEOUT',
  ResetTimeout = 'RESET_TIMEOUT'
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

export type Token =
  | TokenSymbols.westend
  | TokenSymbols.polkadot
  | TokenSymbols.kusama
  | TokenSymbols.astar;

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

export enum SnackbarMessages {
  WalletCreated = 'New Wallet Created',
  AddressCopied = 'Address Copied',
  TransactionSent = 'Transaction Sent',
  AddressAdded = 'New Address Added',
  AddressRemoved = 'Address Removed',
  AutoLockUpdated = 'Auto-Lock Updated',
  WalletRemoved = 'Wallet Removed',
  AccessRevoked = 'Access Revoked',
  DepositRecieved = 'New Deposit Recieved'
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

export const chains = [
  'westend',
  'polkadot',
  'kusama',
  // 'moonriver',
  //  'moonbeam',
  // 'shiden',
  'astar'
];

export interface TokenInfo {
  id: string;
  current_price: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  price_change_percentage_24h: number;
  name: string;
  symbol: string;
}

//==============================================================================
// Polkadot
//==============================================================================

//==============================================================================
// Inject
//==============================================================================

//==============================================================================
// Account
//==============================================================================

export interface AccountMeta {
  img: string;
  name: string;
  whenCreated?: number;
  notSecured?: boolean;
  encodedSeed?: string;
}
