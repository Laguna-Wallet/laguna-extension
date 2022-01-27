import { Asset } from 'utils/types';

// send token
export function changeAddress(address: string) {
  return {
    type: 'CHANGE_ADDRESS',
    payload: { address }
  };
}

export function changeAmount(amount: string) {
  return {
    type: 'CHANGE_AMOUNT',
    payload: { amount }
  };
}

export function setBlockHash(blockHash: string) {
  return {
    type: 'SET_BLOCK_HASH',
    payload: { blockHash }
  };
}

export function selectAsset(selectedAsset: Asset) {
  return {
    type: 'SELECT_ASSET',
    payload: { selectedAsset }
  };
}

export function selectAssetToken(selectedAssetToken: string) {
  return {
    type: 'SELECT_ASSET_TOKEN',
    payload: { selectedAssetToken }
  };
}

// wallet
export function changePrices(prices: Record<string, number>) {
  return {
    type: 'CHANGE_PRICES',
    payload: { prices }
  };
}

export function changeInfo(infos: Record<string, number>) {
  return {
    type: 'CHANGE_INFOS',
    payload: { infos }
  };
}
