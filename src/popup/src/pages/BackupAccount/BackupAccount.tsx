import keyring from '@polkadot/ui-keyring';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import styled from 'styled-components';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { exportAccount, validatePassword } from 'utils/polkadot';
import { goTo } from 'react-chrome-extension-router';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import ExclamationIcon from 'assets/svgComponents/ExclamationIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import Snackbar from 'components/Snackbar/Snackbar';
import { exportJson } from 'utils';

function BackupAccount() {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [seed, setSeed] = useState<string>('');
  const [opened, setOpened] = useState<boolean>(false);
  const [seedExists, setSeedExists] = useState<boolean>(false);
  const account = useAccount();
  const address = account?.getActiveAccount()?.address;

  const onClick = async (password: string) => {
    const isValid = await validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Incorrect Password');
      return;
    }

    setOpened(true);

    const pair = keyring.getPair(address);
    const encodedSeed = pair?.meta?.encodedSeed;

    if (encodedSeed) {
      const bytes = AES.decrypt(encodedSeed as string, password);
      const decodedSeed = bytes.toString(Utf8);

      setSeed(decodedSeed);
    }
  };

  const backupJson = async () => {
    const json = await exportAccount(address, password);
    await exportJson(json);
  };

  useEffect(() => {
    const pair = keyring.getPair(address);
    const encodedSeed = pair?.meta?.encodedSeed;
    if (encodedSeed) {
      setSeedExists(true);
    } else {
      setSeedExists(false);
    }
  });

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
            {seedExists
              ? `Warning: Do not share your seed phrase. This phrase grants full control of your wallet.`
              : 'Account has not been secured, only Json file can be exported'}
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
              placeholder="Enter your password"
              color="#b1b5c3"
              placeholderColor="#b1b5c3"
              bgColor="#414141"
              borderColor="#414141"
              // bgColor="#303030"
              // color="#9c9c9c"
              // borderColor="#303030"
              height="48px"
              marginTop="12px"
            />
          </FieldsContainer>
        )}
        {!seed.length ? (
          <Button
            type="button"
            text={`Reveal ${seedExists ? 'Seed Phrase' : 'Json export'}`}
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
        {opened && <ExportJson onClick={backupJson}>Export Json file</ExportJson>}
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
  background-color: #18191a;
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
  background: linear-gradient(
    243.63deg,
    #f5decc -78.21%,
    #f2d2db -39.06%,
    #d7cce2 5.39%,
    #c7dfe4 49.83%,
    #edf1e1 90.04%,
    #ffffff 124.96%
  );
  border-radius: 100%;
`;

const WarningContainer = styled.div`
  width: 100%;
  height: 60px;
  border: 1px solid #fffa7d;
  border-radius: 5px;
  padding: 11px 5px 11px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
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

const ExportJson = styled.div`
  color: #fff;
  margin-top: 10px;
  font-size: 16px;
  cursor: pointer;
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
