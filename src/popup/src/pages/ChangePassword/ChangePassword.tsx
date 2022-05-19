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
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';
import { encryptPassword, isObjectEmpty, objectToArray } from 'utils';
import { saveToStorage } from 'utils/chrome';
import { encryptKeyringPairs, encryptMetaData, validatePassword } from 'utils/polkadot';
import { Messages, StorageKeys } from 'utils/types';

// todo proper typing
type Props = {
  handleSubmit: any;
};

const validate = async (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Please enter current password';
  }

  if (values.currentPassword && values.currentPassword.length < 8) {
    errors.currentPassword = 'Password should be minimum 8 characters length';
  }

  if (values.currentPassword && !(await validatePassword(values.currentPassword))) {
    errors.currentPassword = 'Please enter correct current password';
  }

  if (!values.newPassword) {
    errors.newPassword = 'Please enter new password';
  }

  if (values.newPassword && values.newPassword.length < 8) {
    errors.newPassword = 'Password should be minimum 8 characters length';
  }

  if (!values.confirmNewPassword) {
    errors.confirmNewPassword = 'Please confirm new password';
  }

  if (values.confirmNewPassword && values.confirmNewPassword.length < 8) {
    errors.confirmNewPassword = 'Please enter correct current password';
  }

  if (
    values.newPassword &&
    values.confirmNewPassword &&
    values.newPassword !== values.confirmNewPassword
  ) {
    errors.newPassword = 'Passwords should match';
  }

  return errors;
};

function ChangePassword({ handleSubmit }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  // todo proper typing
  const submit = async (values: any) => {
    const errors = await validate(values);

    if (!isObjectEmpty(errors)) {
      if (isSnackbarOpen) return;
      const errArray = objectToArray(errors);
      setSnackbarError(errArray[0]);
      setIsSnackbarOpen(true);
      return;
    }

    encryptKeyringPairs(values?.currentPassword, values?.newPassword);
    encryptMetaData(values?.currentPassword, values?.newPassword);

    const newEncryptedPassword = encryptPassword({ password: values?.newPassword });
    saveToStorage({ key: StorageKeys.Encoded, value: newEncryptedPassword });

    // this is needed to update data encryption for the active account in the storage
    const newAccount = keyring.getPair(activeAccount?.address);
    account.saveActiveAccount(newAccount);

    chrome.runtime.sendMessage({
      type: Messages.ReEncryptPairs,
      payload: {
        oldPassword: values?.currentPassword,
        newPassword: values?.newPassword,
        metaData: keyring.getPairs().map((pair) => ({ address: pair.address, meta: pair.meta }))
      }
    });

    goTo(Wallet, { isMenuOpen: true });
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
                color: '#b1b5c3',
                placeholderColor: '#b1b5c3',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030'
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
                color: '#9c9c9c',
                placeholderColor: '#b1b5c3',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030'
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
                color: '#9c9c9c',
                placeholderColor: '#b1b5c3',
                height: '48px',
                marginTop: '12px',
                borderColor: '#303030'
              }}
            />
          </FieldsContainer>

          <ButtonsContainer>
            <Button
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
        bottom="86px"
        transform="translateX(0)"
      />
    </Container>
  );
}

export default connect((state: any) => ({
  //   errors: getFormSyncErrors('sendToken')(state),
  //   amount: formValueSelector('sendToken')(state, 'amount'),
  //   initialValues: {
  //     token: state.sendToken.selectedAsset.symbol
  //   }
}))(
  reduxForm<Record<string, unknown>, any>({
    form: 'changePassword'
    // validate
    // destroyOnUnmount: false,
    // enableReinitialize: true,
    // keepDirtyOnReinitialize: true,
    // updateUnregisteredFields: true
  })(ChangePassword)
);

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
  margin-top: 30px;
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
