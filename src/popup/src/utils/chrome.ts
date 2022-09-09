/*global chrome*/

import browser from "webextension-polyfill";

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
      browser.storage.local.get(key).then((value) => {
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
      browser.storage.local.set({ [key]: value }).then(() => {
        resolve("");
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export function sendMessagePromise(obj: Record<string, unknown>): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    const response = browser.runtime.sendMessage(obj);
    if (response) {
      resolve(response);
    } else {
      reject("Something wrong");
    }

    // , (response) => {
    //   if (response) {
    //     resolve(response);
    //   } else {
    //     reject('Something wrong');
    //   }
    // });
  });
}

export const clearFromStorage = async function (keys: string) {
  return new Promise((resolve, reject) => {
    try {
      browser.storage.local.remove(keys).then(() => {
        resolve("");
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

export function getFromChromeStorage(key: string) {
  return new Promise(function (resolve) {
    browser.storage.local.get([key]).then((result) => {
      resolve(result);
    });
  });
}

export async function saveToChromeStorage({ key, value }: { key: string; value: string }) {
  await browser.storage.local.set({ [key]: value });
}

export const isInPopup = function () {
  return typeof chrome != undefined && chrome.extension
    ? chrome.extension.getViews({ type: "popup" }).length > 0
    : null;
};
