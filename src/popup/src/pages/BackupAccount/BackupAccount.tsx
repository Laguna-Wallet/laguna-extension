import keyring from '@polkadot/ui-keyring';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
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
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { useSelector } from 'react-redux';
import { isObjectEmpty } from 'utils';
import { copyToClipboard, exportJson, validPassword } from 'utils';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';

type Props = {
  password: string;
};

function BackupAccount({ handleSubmit, valid }: InjectedFormProps<Props>) {
  const account = useAccount();
  const address = account?.getActiveAccount()?.address;

  const formValues = useSelector((state: any) => state?.form?.backupAccount?.values);

  const [seed, setSeed] = useState<string>('');
  const [isOpen, setOpen] = useState<boolean>(true);
  const [opened, setOpened] = useState<boolean>(false);
  const [seedExists, setSeedExists] = useState<boolean>(false);
  const [snackbarType, setSnackbarType] = useState<'error' | 'success' | 'warning'>('error');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [mnemonicHasBeenCopied, setMnemonicHasBeenCopied] = useState<boolean>(false);

  const submit = async (values: Props) => {
    const { password } = values;
    const errors = validPassword(values);

    if (isObjectEmpty(errors)) {
      const isValid = await validatePassword(password);

      if (isValid) {
        setOpened(true);

        const pair = keyring.getPair(address);
        const encodedSeed = pair?.meta?.encodedSeed;

        if (encodedSeed) {
          const bytes = AES.decrypt(encodedSeed as string, password);
          const decodedSeed = bytes.toString(Utf8);

          setSeed(decodedSeed);
        }
      } else {
        setIsSnackbarOpen(true);
        setSnackbarMessage('Incorrect Password');
      }
    }
  };

  const backupJson = async () => {
    const json = await exportAccount(address, formValues.password);
    await exportJson(json);
  };

  const handleCopy = () => {
    copyToClipboard(seed);
    setIsSnackbarOpen(true);
    setSnackbarMessage('Mnemonics Copied');
    setSnackbarType('success');
    setMnemonicHasBeenCopied(true);
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
    <Container opened={opened}>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="BACKUP ACCOUNT"
        onClose={() => {
          mnemonicHasBeenCopied && copyToClipboard('');
          goTo(Wallet);
        }}
        backAction={() => {
          mnemonicHasBeenCopied && copyToClipboard('');
          goTo(Wallet, { isMenuOpen: true });
        }}
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
          <>
            <WarningContainer>
              {seedExists
                ? `Warning: Do not share your seed phrase. This phrase grants full control of your account.`
                : 'Account has not been secured, only Json file can be exported'}
            </WarningContainer>
            <Form onSubmit={handleSubmit(submit)}>
              <Field
                id="password"
                name="password"
                type="password"
                label="password"
                placeholder="Enter your password"
                component={HumbleInput}
                props={{
                  type: 'password',
                  color: '#b1b5c3',
                  placeholderColor: '#b1b5c3',
                  bgColor: '#303030',
                  borderColor: '#303030',
                  height: '48px',
                  marginTop: '12px',
                  errorBorderColor: '#fb5a5a',
                  autoFocus: true
                }}
              />
              <Button
                type="submit"
                text={`Reveal ${seedExists ? 'Seed Phrase' : 'Json export'}`}
                color="#111"
                disabledBgColor="rgba(255,255,255,0.6)"
                borderColor="#111"
                justify="center"
                margin="15px 0 0 0"
                bgColor="#fff"
                styledDisabled={!valid}
              />
            </Form>
          </>
        ) : (
          <>
            {opened && seed.length && (
              <CopyBtn onClick={handleCopy}>
                <ButtonsIcon fill="#fff" />
                <span>Copy</span>
              </CopyBtn>
            )}
            <SeedContainer>{seed}</SeedContainer>
            <Button
              type="button"
              text="I’ve Backed my Seed Phrase"
              color="#111"
              justify="center"
              margin="15px 0 0 0"
              bgColor="#fff"
              onClick={() => {
                mnemonicHasBeenCopied && copyToClipboard('');
                goTo(Wallet, { isMenuOpen: true });
              }}
            />
          </>
        )}
        {opened && <ExportJson onClick={backupJson}>Export JSON file</ExportJson>}
      </Content>
      <Snackbar
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        type={snackbarType}
        left="26px"
        bottom="150px"
        transform="translateX(0)"
      />
    </Container>
  );
}

export default reduxForm<Record<string, unknown>, any>({
  form: 'backupAccount',
  validate: validPassword
})(BackupAccount);

const Container = styled.div<{ opened: boolean }>`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: ${({ opened }) => (opened ? '0 17.5px 24px' : '0 17.5px 32px')};
  padding: 0 17.5px 28px;
  box-sizing: border-box;
  background-color: #18191a;
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

const Form = styled.form`
  width: 100%;
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
  height: 80px;
  font-size: 16px;
  background-color: #303030;
  color: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 10px;
`;

const CopyBtn = styled.div`
  width: 70px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #303030;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'IBM Plex Sans';
  margin-top: auto;

  span {
    margin-left: 5px;
  }
`;
const ExportJson = styled.div`
  color: #fff;
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: 1px solid #fff;
  padding-bottom: 3px;
`;

const LockContainer = styled.div`
  position: absolute;
  top: 70px;
`;
