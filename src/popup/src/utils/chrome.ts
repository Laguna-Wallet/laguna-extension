/*global chrome*/

import { StorageKeys } from './types';

// todo refactor localStorage api to chrome.storage
export function saveToStorage({ key, value }: { key: string; value: string }) {
  localStorage.setItem(key, value);
}

export function getFromStorage(key: string) {
  return localStorage.getItem(key);
}

export function clearFromStorage(key: string) {
  return localStorage.removeItem(key);
}

export function getFromChromeStorage(key: string) {
  return new Promise(function (resolve) {
    chrome.storage.local.get([key], function (result) {
      resolve(result);
    });
  });
}

export async function saveToChromeStorage({ key, value }: { key: string; value: string }) {
  await chrome.storage.local.set({ [key]: value }, function () {
    console.log('Value is set to ' + value);
  });
}
