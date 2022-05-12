import keyring from '@polkadot/ui-keyring';
import RemoveAccountIcon from 'assets/svgComponents/RemoveAccountIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useDispatch } from 'react-redux';
import { toggleLoading } from 'redux/actions';
import styled from 'styled-components';
import { truncateString } from 'utils';
import { clearFromStorage } from 'utils/chrome';
import { validatePassword } from 'utils/polkadot';
import { Messages, SnackbarMessages, StorageKeys } from 'utils/types';

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
  const handleRemove = async () => {
    if (!address) return;

    const isValid = await validatePassword(password);

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

    chrome.runtime.sendMessage({
      type: Messages.RemoveFromKeyring,
      payload: { address }
    });

    goTo(Wallet, { snackbar: { show: true, message: SnackbarMessages.WalletRemoved } });
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="REMOVE ACCOUNT"
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
          height="48px"
          bgColor="#303030"
          borderColor="#color"
          color="#9c9c9c"
          placeholderColor="#9c9c9c"
          marginTop="0"
        />

        <ButtonContainer>
          <Button
            onClick={() => goTo(Wallet, { isMenuOpen: true })}
            text="Cancel"
            color="#fff"
            bgColor="#414141"
            borderColor="transparent"
            justify="center"
            margin="0"
          />

          <Button
            onClick={handleRemove}
            text="Save"
            color="#23262F"
            bgColor="#fff"
            borderColor="transparent"
            justify="center"
            margin="0 0 0 15px"
          />
        </ButtonContainer>
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="26px"
        bottom="44px"
        transform='translateX(0)'
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
  padding: 0 17.5px 44px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 8.5px;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div`
  width: 122px;
  height: 122px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: 57px;
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
  margin: 39px 0;
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
  margin-top: 19px;
`;
