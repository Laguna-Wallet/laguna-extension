import { MnemonicsTriple } from './types';
import { saveAs } from 'file-saver';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import bcrypt from 'bcryptjs';

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

export function isFormikErrorEmpty(errors: Record<string, string>): boolean {
  return !Object.keys(errors).length;
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function calculatePasswordCheckerColor(passwordLength: string) {
  if (passwordLength === 'Too weak') return 'red';
  if (passwordLength === 'Weak') return 'orange';
  if (passwordLength === 'Medium') return 'yellow';
  if (passwordLength === 'Strong') return 'green';
  return 'red';
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
    });12
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export function encryptPassword({ password }: { password: string }) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export function truncateString(string: string, length?: number) {
  const part1 = string.slice(0, length || 4).concat('...');
  const part2 = string.substring(string.length - (length || 4), string.length);
  return `${part1}${part2}`;
}

export function objectValuesToArray(obj: Record<string, string>): string[] {
  return Object.values(obj).map((item) => item);
}

export function isObjectEmpty(obj: Record<string, string>): boolean {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

export function objectToArray(obj: Record<string, unknown>): any[] {
  return Object.keys(obj).map((key) => [obj[key]]);
}
