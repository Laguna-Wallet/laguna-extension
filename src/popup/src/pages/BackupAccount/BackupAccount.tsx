import keyring from '@polkadot/ui-keyring';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { validatePassword } from 'utils/polkadot';
import { goTo } from 'react-chrome-extension-router';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import ExclamationIcon from 'assets/svgComponents/ExclamationIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import Snackbar from 'components/Snackbar/Snackbar';

function BackupAccount() {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [seed, setSeed] = useState<string>('');
  const account = useAccount();
  const address = account?.getActiveAccount()?.address;

  const onClick = (password: string) => {
    const isValid = validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Incorrect Password');
      return;
    }

    const pair = keyring.getPair(address);
    const encodedSeed = pair?.meta?.encodedSeed;

    const bytes = AES.decrypt(encodedSeed as string, password);
    const decodedSeed = bytes.toString(Utf8);

    setSeed(decodedSeed);
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="BACKUP ACCOUNT"
        onClose={() => goTo(Wallet)}
        backAction={() => goTo(Wallet, { isMenuOpen: true })}
      />

      <Content>
        <IconContainer>
          <ExclamationIconContainer>
            <ExclamationIcon />
          </ExclamationIconContainer>
          <Circle></Circle>
          <LockContainer>
            <LockIcon />
          </LockContainer>
        </IconContainer>

        {!seed.length ? (
          <WarningContainer>
            Warning: Do not share your seed phrase. This phrase grants full control of your wallet.
          </WarningContainer>
        ) : (
          <SeedContainer>{seed}</SeedContainer>
        )}
        {!seed.length && (
          <FieldsContainer>
            <HumbleInput
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              label="password"
              placeholder="password"
              bgColor="#303030"
              color="#9c9c9c"
              height="48px"
              marginTop="12px"
              borderColor="#303030"
            />
          </FieldsContainer>
        )}
        {!seed.length ? (
          <Button
            type="button"
            text="Reveal Seed Phrase"
            color="#111"
            justify="center"
            margin="15px 0 0 0"
            bgColor="#e4e4e4"
            onClick={() => onClick(password)}
          />
        ) : (
          <Button
            type="button"
            text="I’ve Backed my Seed Phrase"
            color="#111"
            justify="center"
            margin="15px 0 0 0"
            bgColor="#e4e4e4"
            onClick={() => goTo(Wallet, { isMenuOpen: true })}
          />
        )}
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarError}
        type="error"
        left="0px"
        bottom="100px"
      />
    </Container>
  );
}

export default BackupAccount;

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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 25px;
`;

const ExclamationIconContainer = styled.div`
  width: 31px;
  height: 31px;
  border-radius: 100%;
  background-color: #fffa7d;
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(265.71deg, #1cc3ce -32.28%, #b9e260 104.04%);
  border-radius: 100%;
`;

const WarningContainer = styled.div`
  width: 100%;
  height: 60px;
  border: 1px solid #fffa7d;
  border-radius: 5px;
  padding: 11px 5px 11px 10px;
  box-sizing: border-box;
  margin-top: auto;
  color: #fff;
  font-size: 16px;
  font-family: SFCompactDisplayRegular;
  text-align: center;
`;

const SeedContainer = styled.div`
  width: 100%;
  height: 60px;
  font-size: 16px;
  background-color: #303030;
  color: #fff;
  margin-top: auto;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const LockContainer = styled.div`
  position: absolute;
  top: 70px;
`;

const FieldsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
`;
