/* eslint-disable */

import * as yup from 'yup';
import { SEED_LENGTHS } from './types';
import { mnemonicValidate } from '@polkadot/util-crypto';

export const createPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Must be at least 8 characters')
    .required('Please fill out this field')
    .oneOf([yup.ref('confirmPassword'), null], 'Passwords do not match'),

  confirmPassword: yup
    .string()
    .min(8, 'Must be at least 8 characters')
    .required('Please fill out this field')
    .oneOf([yup.ref('password'), null], 'Passwords do not match')
});

// todo refactor to one password schema
export const welcomeBackSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Must be at least 8 characters')
    .required('Please fill out this field')
});

export const exportAllSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Must be at least 8 characters')
    .required('Please fill out this field')
});

export const exportAccountSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Must be at least 8 characters')
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
  if (str === '.') return '';
  return str.replace(/[^.\d]/g, '').replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const asyncValidate = (values: Record<string, unknown>) => {
  return sleep(1000).then(() => {});
};
