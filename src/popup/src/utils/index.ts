import { MnemonicsTriple, StorageKeys } from './types';
import { saveAs } from 'file-saver';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import bcrypt from 'bcryptjs';
import { getFromStorage } from './chrome';
import keyring from '@polkadot/ui-keyring';
import Resizer from 'react-image-file-resizer';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import BigNumber from 'bignumber.js';

//==============================================================================
// Mnemonics
//==============================================================================

export function generateThreeRandomMnemonicIndexes(): MnemonicsTriple {
  const nums = new Set();
  while (nums.size !== 3) {
    nums.add(Math.floor(Math.random() * 11) + 1);
  }
  const numArr: number[] = Array.from(nums) as number[];

  return numArr.sort((a, b) => a - b) as MnemonicsTriple;
}

export function validateMnemonicChoice(
  mnemonics: string[],
  chosenArr: string[],
  targetIndexes: MnemonicsTriple
): boolean {
  if (chosenArr.length !== 3) return false;

  let index = 0;
  for (const iterator of chosenArr) {
    const chosenIndex = mnemonics.indexOf(iterator);

    if (chosenIndex !== targetIndexes[index]) return false;

    index++;
  }

  return true;
}

export function generateNumberAbbreviation(num: number): string {
  if (num === 1) return '1st word';
  if (num === 2) return '2nd word';
  if (num === 3) return '3rd word';
  return `${num}th word`;
}

export function mnemonicsAreChecked(ht: Record<string, boolean>): boolean {
  for (const [key, value] of Object.entries(ht)) {
    if (!value) return false;
  }

  return true;
}

//==============================================================================
// Shared
//==============================================================================

export function getAccountNameByAddress(address: string): string | undefined {
  const pair: KeyringPair = keyring.getPair(address);
  return (pair?.meta?.name as string) || undefined;
}

export function getContactNameByAddress(address: string): string | undefined {
  const pair = keyring.getAddress(address);
  return (pair?.meta?.name as string) || undefined;
}

export async function generateRandomBase64Avatar() {
  const random = Math.floor(Math.random() * 10);
  const image = (await import(`../assets/imgs/avatars/avatar-${random}.png`)).default;
  return image;
}

export function isFormikErrorEmpty(errors: Record<string, string>): boolean {
  return !Object.keys(errors).length;
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function calculatePasswordCheckerColor(passwordLength: string) {
  if (passwordLength === 'Poor') return '#FB5A5A';
  if (passwordLength === 'Fair') return '#FFC44C';
  if (passwordLength === 'Good') return '#458FFF';
  if (passwordLength === 'Excellent') return '#00A47C';
  return '#FB5A5A';
}

export function exportJson(json: any) {
  const blob = new Blob([JSON.stringify(json)], {
    type: 'application/json; charset=utf-8'
  });
  saveAs(blob, `exported_accounts_${Date.now()}.json`);
}

export async function convertUploadedFileToJson(
  acceptedFile: File[]
): Promise<KeyringPair$Json | KeyringPairs$Json> {
  try {
    return await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.readAsText(acceptedFile[0], 'UTF-8');
      fileReader.onload = (e: any) => {
        resolve(JSON.parse(e.target.result));
      };
    });
    12;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function clearAccountsFromStorage(address?: string) {
  const pairs = keyring.getPairs();

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (address && recodeToPolkadotAddress(address) !== recodeToPolkadotAddress(pair.address)) {
      keyring.forgetAccount(pair.address);
    }
  }
}

export function recodeToPolkadotAddress(address: string): string {
  const publicKey = decodeAddress(address);
  return encodeAddress(publicKey, 0);
}

export function encryptPassword({ password }: { password: string }) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export function truncateString(string: string, length?: number): string {
  if (!string) return string;
  if (string.length <= (length || 4 * 2)) return string;
  const part1 = string.slice(0, length || 4).concat('...');
  const part2 = string.substring(string.length - ((length && length + 2) || 4), string.length);
  return `${part1}${part2}`;
}

export function objectValuesToArray(obj: Record<string, string>): string[] {
  return Object.values(obj).map((item) => item);
}

export function isObjectEmpty(obj: Record<string, string> | undefined): boolean {
  if (!obj) return false;
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

export function objectToArray(obj: Record<string, unknown>): any[] {
  return Object.keys(obj).map((key) => [obj[key]]);
}

export function transformAmount(obj: Record<string, unknown>): any[] {
  return Object.keys(obj).map((key) => [obj[key]]);
}

export async function accountHasChanged(balances: Record<string, string>) {
  const account = await getFromStorage(StorageKeys.ActiveAccount);
  if (!account) return false;
  const address = JSON.parse(account as string).address;
  if (balances.address === address) return true;
  return false;
}

export async function updateBallanceCache(chain: string, amount: string, fee: string) {
  const balances = await getFromStorage(StorageKeys.AccountBalances);

  const parsed = balances && JSON.parse(balances);
  console.log('~ parsed', parsed);
  console.log('~ chain', chain);
  console.log('~ amount', amount);
  console.log('fee', fee);

  const sum = new BigNumber(amount).plus(fee).toString();
  console.log('~ balances', new BigNumber(parsed.balances[chain].overall).minus(sum).toString());
}

export function timer(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export function getAccountImage(address: string): string {
  const pair = keyring.getPair(address);
  return pair?.meta?.img as string;
}

export const resizeFile = (file: File) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });

export const enhancePasswordStrength = (string: string): string => {
  if (string === 'Too weak') return 'Poor';
  if (string === 'Weak') return 'Fair';
  if (string === 'Medium') return 'Good';
  if (string === 'Strong') return 'Excellent';
  return '';
};

export const validPassword = (values: { password: string }) => {
  const { password } = values;
  const errors: Record<string, string> = {};
  if (!password) {
    errors.password = 'Required';
  }
  if (password?.length < 8) {
    errors.password = 'Must be at least 8 characters';
  }

  return errors;
};
