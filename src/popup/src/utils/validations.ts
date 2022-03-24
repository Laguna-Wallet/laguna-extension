/* eslint-disable */

import * as yup from 'yup';
import { isHex } from '@polkadot/util';
import { SEED_LENGTHS } from './types';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { isKeyringPairs$Json } from './polkadot';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { convertUploadedFileToJson } from 'utils';

export const createPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Please fill out this field')
    .oneOf([yup.ref('confirmPassword'), null], 'Passwords do not match'),

  confirmPassword: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Please fill out this field')
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
});

// todo refactor to one password schema
export const welcomeBackSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Please fill out this field')
});

export const exportAllSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Please fill out this field')
});

export const exportAccountSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Please fill out this field')
});

export const sendTokenSchema = yup.object().shape({
  amount: yup.number().required('Please fill out this field'),
  selectedAsset: yup.object().required('Asset should be chosen'),
  // maybe todo check if it's a valid address
  address: yup.string().required('Please fill out this field')
});

export const addAddressSchema = yup.object({
  name: yup.string().required('Please fill out this field'),
  address: yup.string().required('Please fill out this field')
});

export const validateSeedPhase = (values: any) => {
  const errors: any = {};

  if (!values.seedPhase) return {};

  if (!mnemonicValidate(values.seedPhase)) {
    errors.seedPhase = `Not a valid mnemonic seed`;
  }

  if (!SEED_LENGTHS.includes(values.seedPhase.split(' ').length)) {
    errors.seedPhase = `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`;
  }

  if (/[!@#$%^&*(),.?":{}|<>]/g.test(values.seedPhase.toString())) {
    errors.seedPhase = `Please remove special characters (!,#:*)`;
  }
  return errors;
};

export function isNumeric(str: string | number) {
  if (typeof str != 'string') return false;
  return !isNaN(str as any) && !isNaN(parseFloat(str));
}

export function parseNumeric(str: string) {
  return str.replace(/[^0-9\.]+/g, '');
}
