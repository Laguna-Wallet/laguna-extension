import keyring from '@polkadot/ui-keyring';
import LockLogoIcon from 'assets/svgComponents/LockLogoIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import styled from 'styled-components';
import { encryptPassword, isObjectEmpty, objectToArray } from 'utils';
import { saveToStorage } from 'utils/chrome';
import { encryptKeyringPairs, encryptMetaData, validatePassword } from 'utils/polkadot';
import { Messages, SnackbarMessages, StorageKeys } from 'utils/types';

type Form = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const validate = (values: Form) => {
  const errors: Record<string, string> = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Please enter current password';
  }

  if (values.currentPassword && values.currentPassword.length < 8) {
    errors.currentPassword = 'Password should be minimum 8 characters length';
  }

  if (!values.newPassword) {
    errors.newPassword = 'Please enter new password';
  }

  if (values.newPassword && values.newPassword.length < 8) {
    errors.newPassword = 'New Password should be minimum 8 characters length';
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = 'Please confirm new password';
  }

  if (values.confirmNewPassword && values.confirmNewPassword.length < 8) {
    errors.confirmNewPassword = 'New Password should be minimum 8 characters length';
  }

  if (
    values.newPassword &&
    values.confirmNewPassword &&
    values.newPassword !== values.confirmNewPassword
  ) {
    errors.newPassword = 'New Passwords do not match';
  }

  return errors;
};

function ChangePassword({ handleSubmit, valid }: InjectedFormProps<Form>) {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  const [isOpen, setOpen] = useState<boolean>(true);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  // todo proper typing
  const submit = async (values: Form) => {
    const errors = await validate(values);

    if (!isObjectEmpty(errors)) {
      if (isSnackbarOpen) return;
      const errArray = objectToArray(errors);
      setSnackbarError(errArray[0]);
      setIsSnackbarOpen(true);
    }

    if (values.currentPassword && !(await validatePassword(values.currentPassword))) {
      setSnackbarError('Incorrect current password');
      setIsSnackbarOpen(true);
    } else {
      chrome.runtime.sendMessage({
        type: Messages.ReEncryptPairs,
        payload: {
          oldPassword: values?.currentPassword,
          newPassword: values?.newPassword,
          metaData: keyring.getPairs().map((pair) => ({ address: pair.address, meta: pair.meta }))
        }
      });
      encryptKeyringPairs(values?.currentPassword, values?.newPassword);
      encryptMetaData(values?.currentPassword, values?.newPassword);

      const newEncryptedPassword = encryptPassword({ password: values?.newPassword });
      saveToStorage({ key: StorageKeys.Encoded, value: newEncryptedPassword });

      // this is needed to update data encryption for the active account in the storage
      const newAccount = keyring.getPair(activeAccount?.address);
      account.saveActiveAccount(newAccount);

      goTo(Wallet, { snackbar: { show: true, message: SnackbarMessages.PasswordChanged } });
    }
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="CHANGE PASSWORD"
        onClose={() => goTo(Wallet)}
        backAction={() => goTo(Wallet, { isMenuOpen: true })}
      />

      <Content>
        <IconContainer>
          <LockLogoIcon fill="#fff" />
        </IconContainer>
        <Form onSubmit={handleSubmit(submit)}>
          <FieldsContainer>
            <Field
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current password"
              placeholder="Current password"
              component={HumbleInput}
              props={{
                type: 'password',
                bgColor: '#303030',
                padding: '15px 11px 15px 16px',
                color: '#fff',
                placeholderColor: '#b1b5c3',
                errorBorderColor: '#fb5a5a',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030',
                showError: true,
                errorColor: '#FB5A5A',
                isPassword: true
              }}
            />
            <Field
              id="newPassword"
              name="newPassword"
              type="password"
              label="New password"
              placeholder="New password"
              component={HumbleInput}
              props={{
                type: 'password',
                bgColor: '#303030',
                padding: '15px 11px 15px 16px',
                color: '#fff',
                placeholderColor: '#b1b5c3',
                errorBorderColor: '#fb5a5a',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030',
                showError: true,
                errorColor: '#FB5A5A',
                isPassword: true
              }}
            />
            <Field
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              label="Confirm new password"
              placeholder="Confirm new password"
              component={HumbleInput}
              props={{
                type: 'password',
                bgColor: '#303030',
                padding: '15px 11px 15px 16px',
                color: '#fff',
                placeholderColor: '#b1b5c3',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030',
                errorBorderColor: '#fb5a5a',
                showError: true,
                errorColor: '#FB5A5A',
                isPassword: true
              }}
            />
          </FieldsContainer>

          <ButtonsContainer>
            <Button
              type="button"
              onClick={() => goTo(Wallet, { isMenuOpen: true })}
              text="Cancel"
              color="#fff"
              bgColor="#414141"
              borderColor="#414141"
              justify="center"
              margin="auto 10px 0 0"
            />

            <Button
              type="submit"
              text="Save"
              color="#111"
              justify="center"
              margin="auto 0 0 0"
              bgColor="#fff"
              bgImage="#fff"
              disabledBorderColor="rgba(255, 255, 255, 0.5)"
              disabledColor="#18191a"
              disabledBgColor="rgba(255, 255, 255, 0.5)"
              styledDisabled={!valid}
            />
          </ButtonsContainer>
        </Form>
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="26px"
        bottom="90px"
        transform="translateX(0)"
      />
    </Container>
  );
}

export default reduxForm<Record<string, unknown>, any>({
  form: 'changePassword',
  validate
})(ChangePassword);

const Container = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0 17.5px 44px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  padding: 0 8.5px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  width: 129px;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: 30px;
`;

const Form = styled.form`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* margin-top: 10px; */
`;

const FieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: auto;
`;
