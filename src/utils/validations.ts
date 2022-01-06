import * as yup from 'yup';

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

export const sendTokenSchema = yup.object({
  amount: yup.string().required('Please fill out this field'),
  selectedAsset: yup.object().required('Asset should be chosen'),
  // maybe todo check if it's a valid address
  address: yup.string().required('Please fill out this field')
});
