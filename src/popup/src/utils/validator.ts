// import { Schema } from 'yup';

// todo proper typing
export const validator =
  <T>(schema: any) =>
  async (formValues: any) => {
    try {
      await schema.validate(formValues, { abortEarly: false });
      return {};
    } catch (errors: any) {
      return errors.inner.reduce(
        (errors: any, err: any) => ({
          ...errors,
          [err.path]: err.message
        }),
        {}
      );
    }
  };

export default validator;
