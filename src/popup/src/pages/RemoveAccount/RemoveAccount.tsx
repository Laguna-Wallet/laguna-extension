import keyring from '@polkadot/ui-keyring';
import RemoveAccountIcon from 'assets/svgComponents/RemoveAccountIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import React, { useState } from 'react';
import { goTo, Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { truncateString } from 'utils';

export default function RemoveAccount() {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  const name = activeAccount?.meta?.name;
  const address = activeAccount?.address;
  const handleRemove = () => {
    if (!address) return;
    keyring.forgetAccount(address);
    const first = keyring?.getAccounts()[0];
    if (first) {
      account.saveActiveAccount(first);
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
          This will remove the current wallet ({name && name > 12 ? truncateString(name) : name}){' '}
          {address && truncateString(address)} from your account. Please confirm below.
        </Text>
        <ButtonContainer>
          <Button
            onClick={() => goTo(Wallet, { isMenuOpen: true })}
            text="Cancel"
            color="#111"
            bgColor="#ececec"
            borderColor="#ececec"
            justify="center"
            margin="auto 0 0 0"
          />

          <Button
            onClick={handleRemove}
            text="Remove"
            color="#fff"
            bgColor="#fb5a5a"
            borderColor="#fb5a5a"
            justify="center"
            margin="auto 0 0 10px"
          />
        </ButtonContainer>
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="0px"
        bottom="110px"
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
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
