/*global chrome*/

import { StorageKeys } from './types';

// todo refactor localStorage api to chrome.storage
// export function saveToStorage({ key, value }: { key: string; value: string }) {
//   localStorage.setItem(key, value);
// }

// export function getFromStorage(key: string) {
//   return localStorage.getItem(key);
// }

// export function clearFromStorage(key: string) {
//   return localStorage.removeItem(key);
// }

export const getFromStorage = async function (key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export const saveToStorage = async function ({ key, value }: { key: string; value: any }) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [key]: value }, function () {
        resolve('');
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export const clearFromStorage = async function (keys: string) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, function () {
        resolve('');
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export function getFromChromeStorage(key: string) {
  return new Promise(function (resolve) {
    chrome.storage.local.get([key], function (result) {
      resolve(result);
    });
  });
}

export async function saveToChromeStorage({ key, value }: { key: string; value: string }) {
  await chrome.storage.local.set({ [key]: value });
}
