import { CheckIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import LockIcon from 'assets/svgComponents/LockIcon';
import LockLogoIcon from 'assets/svgComponents/LockLogoIcon';
import RemoveAccountIcon from 'assets/svgComponents/RemoveAccountIcon';
import ShareIcon from 'assets/svgComponents/ShareIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import React, { useEffect, useState } from 'react';
import { goTo, Link } from 'react-chrome-extension-router';
import { connect, useSelector } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import styled from 'styled-components';
import { encryptPassword, isObjectEmpty, objectToArray, truncateString } from 'utils';
import { saveToStorage } from 'utils/chrome';
import { encryptKeyringPairs, encryptMetaData, validatePassword } from 'utils/polkadot';
import { Messages, SnackbarMessages, StorageKeys } from 'utils/types';

// todo proper typing
type Props = {
  handleSubmit: any;
};

function ConnectedSites({ handleSubmit }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  const { connectedApps } = useSelector((state: any) => state.wallet);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: Messages.ConnectedApps
    });
  }, []);

  const handleRevoke = (dappName: string) => {
    chrome.runtime.sendMessage({ type: Messages.RevokeDapp, payload: { dappName } });
    setIsSnackbarOpen(true);
    setSnackbarMessage(SnackbarMessages.AccessRevoked);
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="CONNECTED SITES"
        onClose={() => goTo(Wallet)}
        backAction={() => goTo(Wallet, { isMenuOpen: true })}
      />

      <Content>
        {connectedApps?.connectedApps?.length ? (
          connectedApps?.connectedApps.map((item: string, index: number) => (
            <ConnectedAppItem key={`${item}-${index}`}>
              <CheckIcon width={25} height={25} stroke="#68dd65" />
              <AppName>{item}</AppName>
              <RevokeBtn onClick={() => handleRevoke(item)}>Revoke</RevokeBtn>
            </ConnectedAppItem>
          ))
        ) : (
          <>
            <IconContainer>
              <ShareIcon />
            </IconContainer>
            <Text>No Trusted Apps</Text>
          </>
        )}
      </Content>
      <Snackbar
        width="194.9px"
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        type="success"
        // left="110px"
        bottom="50px"
      />
    </Container>
  );
}

export default ConnectedSites;

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
  margin-top: 30px; /* justify-content: center; */
`;

const ConnectedAppItem = styled.div`
  width: 323px;
  height: 48px;
  padding: 9px 11px 10px 12px;
  box-sizing: border-box;
  border-radius: 4.1px;
  background-color: #303030;
  align-items: center;
  display: flex;
`;

const AppName = styled.div`
  color: #fff;
  font-size: 16px;
  margin-left: 5px;
`;

const RevokeBtn = styled.div`
  width: 74px;
  height: 29px;
  border-radius: 4px;
  background-color: #fb5a5a;
  padding: 10px;
  box-sizing: border-box;
  margin-left: auto;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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

const Text = styled.div`
  font-size: 18px;
  line-height: 1.35;
  color: #656565;
  margin-top: 10px;
`;
