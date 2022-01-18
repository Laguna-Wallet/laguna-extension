/*global chrome*/

import { StorageKeys } from './types';

// todo refactor localStorage api to chrome.storage
export function saveToStorage({ key, value }: { key: string; value: string }) {
  // chrome.storage.local.set({ key: value }, function () {
  //   console.log('Value is set to ' + value);
  // });
  localStorage.setItem(key, value);
}

export function getFromStorage(key: string) {
  return localStorage.getItem(key);
  // return chrome.storage.local.get([key], function (result) {
  //   console.log('Value currently is ' + result.key);
  // });
}

export function clearFromStorage(key: string) {
  return localStorage.removeItem(key);
  // return chrome.storage.local.get([key], function (result) {
  //   console.log('Value currently is ' + result.key);
  // });
}

export function getFromChromeStorage(key: string) {
  return chrome.storage.local.get(key, function (result) {
    console.log('Value currently is ' + result);
  });
}
