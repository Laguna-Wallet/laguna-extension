import keyring from '@polkadot/ui-keyring';
import RemoveAccountIcon from 'assets/svgComponents/RemoveAccountIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import React, { useState } from 'react';
import { goTo, Link } from 'react-chrome-extension-router';
import { useDispatch } from 'react-redux';
import { toggleLoading } from 'redux/actions';
import styled from 'styled-components';
import { truncateString } from 'utils';
import { clearFromStorage } from 'utils/chrome';
import { validatePassword } from 'utils/polkadot';
import { StorageKeys } from 'utils/types';

export default function RemoveAccount() {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  const name = activeAccount?.meta?.name;
  const address = activeAccount?.address;
  const handleRemove = () => {
    if (!address) return;

    const isValid = validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Password is not valid');
      return;
    }

    keyring.forgetAccount(address);
    const first = keyring?.getAccounts()[0];
    clearFromStorage(StorageKeys.AccountBalances);
    dispatch(toggleLoading(true));
    if (first) {
      account.saveActiveAccount(first);
    } else {
      account.saveActiveAccount({});
    }
    goTo(Wallet);
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="REMOVE WALLET"
        onClose={() => goTo(Wallet)}
        backAction={() => goTo(Wallet, { isMenuOpen: true })}
      />

      <Content>
        <IconContainer>
          <RemoveAccountIcon />
        </IconContainer>

        <Text>
          This will remove the current wallet{' '}
          <span>
            ({name?.length > 12 ? truncateString(name) : name}) {address && truncateString(address)}{' '}
          </span>
          from your account. Please confirm below.
        </Text>

        <HumbleInput
          id="password"
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e: any) => setPassword(e.target.value)}
          height="45px"
          bgColor="#303030"
          borderColor="#303030"
          color="#9c9c9c"
          marginTop="auto"
        />

        <ButtonContainer>
          <Button
            onClick={() => goTo(Wallet, { isMenuOpen: true })}
            text="Cancel"
            color="#111"
            bgColor="#ececec"
            borderColor="#ececec"
            justify="center"
            margin="10px 0 0 0"
          />

          <Button
            onClick={handleRemove}
            text="Remove"
            color="#fff"
            bgColor="#fb5a5a"
            borderColor="#fb5a5a"
            justify="center"
            margin="10px 0 0 10px"
          />
        </ButtonContainer>
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="0px"
        bottom="145px"
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 15px 15px 40px 15px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
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
  margin-top: auto;
`;

const StyledLink = styled.div`
  width: 100%;
  text-decoration: none;
  margin-top: auto;
`;

const Text = styled.div`
  font-family: SFCompactDisplayRegular;
  font-size: 18px;
  color: #dfdfdf;
  margin-top: 30px;
  text-align: center;
  border: 1px solid #fffa7d;
  padding: 10px;
  box-sizing: border-box;
  span {
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
`;
