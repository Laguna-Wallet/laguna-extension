import { KeypairType } from '@polkadot/util-crypto/types';
import type { Signer as InjectedSigner } from '@polkadot/api/types';
import type { ExtDef } from '@polkadot/types/extrinsic/signedExtensions/types';
import type { ProviderInterface } from '@polkadot/rpc-provider/types';
import { EVMAssetType } from './evm/networks/asset';
import { EVMNetwork } from './evm/networks';

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
  ethereumBalances = 'ethereum-balances',
  Transactions = 'transactions',
  EthereumTransactions = 'ethereum-transactions',
  IdleTimeout = 'idle-timeout',
  UnlockedPairs = 'unlocked-pairs',
  TokenDecimals = 'token-decimals',
  DisabledTokens = 'disabled-tokens',
  OnBoarding = 'onboarding'
}

// Array of contract addresses specific to ERC-20 tokens (ETH is a native token so it does not have an address)
export const contractAddresses = [
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  'eth' // Ethereum
];

//==============================================================================
// Polkadot
//==============================================================================
export interface Network {
  name: string;
  symbol: Token;
  chain: EVMNetwork | 'westend' | 'polkadot' | 'kusama';
  node?: string;
  price_change_percentage_24h?: number;
  marketCap?: number;
  encodeType?: string;
  prefix?: number;
  decimal?: number;
  assetType?: EVMAssetType.NATIVE | EVMAssetType.ERC20;
  contractAddress?: string;
}

export interface Asset {
  name: string;
  symbol: string;
  chain: string;
  balance?: { overall: number; locked: number };
  calculatedPrice?: number;
  price?: number;
  encodeType?: string;
  prefix?: number;
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
  SignRawRequest = 'SIGN_RAW_REQUEST',
  ForgotPassword = 'FORGOT_PASSWORD',
  ReopenKeyPairs = 'REOPEN_KEYPAIRS',
  AddToKeyring = 'ADD_TO_KEYRING',
  RemoveFromKeyring = 'REMOVE_FROM_KEYRING',
  ReEncryptPairs = 'RE_ENCRYPT_PAIRS',
  DappAuthorization = 'DAPP_AUTHORIZATION',
  CheckPendingDappAuth = 'CHECK_PENDING_DAPP_AUTH',
  CheckPendingSign = 'CHECK_PENDING_SIGN',
  CheckPendingSignRaw = 'CHECK_PENDING_SIGN_RAW',
  SignRequest = 'SIGN_REQUEST',
  DappAuthRequest = 'DAPP_AUTH_REQUEST',
  ConnectedApps = 'CONNECTED_APPS',
  RevokeDapp = 'REVOKE_DAPP',
  TokenReceived = 'TOKEN_RECEIVED',
  Timeout = 'TIMEOUT',
  ResetTimeout = 'RESET_TIMEOUT',
  FreezeAccountBalanceUpdate = 'FREEZE_ACCOUNT_BALANCE_UPDATE',
  OpenSupport = 'OPEN_SUPPORT'
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
  astar = 'astr',
  ethereum = 'ETH',
  USDC = 'USDC',
  USDT = 'USDT',
  TBC = 'TBC',
  ALOT = 'ALOT',
  AVAX = 'AVAX'
}

export type Token =
  | TokenSymbols.westend
  | TokenSymbols.polkadot
  | TokenSymbols.kusama
  | TokenSymbols.astar
  | TokenSymbols.ethereum
  | TokenSymbols.USDC
  | TokenSymbols.USDT
  | TokenSymbols.TBC
  | TokenSymbols.ALOT
  | TokenSymbols.AVAX;

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
  WalletCreated = 'New Account Created',
  AddressCopied = 'Address Copied',
  TransactionSent = 'Transaction Sent',
  AddressAdded = 'New Address Added',
  AddressRemoved = 'Address Removed',
  AutoLockUpdated = 'Auto-Lock Updated',
  WalletRemoved = 'Account Removed',
  AccessRevoked = 'Access Revoked',
  DepositReceived = 'New Deposit Received',
  PasswordChanged = 'Password Changed'
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

export const networks: Network[] = [
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
  },
  {
    name: 'Ethereum',
    symbol: TokenSymbols.ethereum,
    chain: EVMNetwork.ETHEREUM,
    decimal: 18,
    assetType: EVMAssetType.NATIVE
  }
  // {
  //   name: 'USD Coin',
  //   symbol: TokenSymbols.USDC,
  //   chain: EVMNetwork.ETHEREUM,
  //   decimal: 6,
  //   assetType: EVMAssetType.ERC20,
  //   contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  // },
  // {
  //   name: 'Tether USD',
  //   symbol: TokenSymbols.USDT,
  //   chain: EVMNetwork.ETHEREUM,
  //   decimal: 6,
  //   assetType: EVMAssetType.ERC20,
  //   contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  // },
  // {
  //   name: 'Ethereum',
  //   symbol: TokenSymbols.ethereum,
  //   chain: EVMNetwork.ETHEREUM_TESTNET_GOERLI,
  //   decimal: 18,
  //   assetType: EVMAssetType.NATIVE
  // },
  // {
  //   name: 'TBC',
  //   symbol: TokenSymbols.TBC,
  //   chain: EVMNetwork.ETHEREUM_TESTNET_GOERLI,
  //   decimal: 18,
  //   assetType: EVMAssetType.ERC20,
  //   contractAddress: 'TBC'
  // }
  // {
  //   name: 'Avalanche',
  //   chain: EVMNetwork.AVALANCHE_TESTNET_FUJI,
  //   symbol: TokenSymbols.AVAX,
  //   decimal: 18,
  //   assetType: EVMAssetType.NATIVE
  // },
  // {
  //   name: 'Dexalot Token',
  //   symbol: TokenSymbols.ALOT,
  //   chain: EVMNetwork.AVALANCHE_TESTNET_FUJI,
  //   decimal: 18,
  //   assetType: EVMAssetType.ERC20,
  //   contractAddress: '0x9983F755Bbd60d1886CbfE103c98C272AA0F03d6'
  // }

  // {
  //   name: 'Astar',
  //   symbol: TokenSymbols.astar,
  //   chain: 'astar',
  //   node: 'wss://astar.api.onfinality.io/public-ws',
  //   prefix: 5
  // },
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
