import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { importJson, importViaSeed, validatePassword } from 'utils/polkadot';
import WizardHeader from './WizardHeader';

import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import { reset } from 'redux-form';
import { useWizard } from 'react-use-wizard';

export default function EncodeAccount() {
  const [password, setPassword] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const { previousStep } = useWizard();

  const dispatch = useDispatch();

  const formValues = useSelector((state: any) => state?.form?.AddImportAccount?.values);
  const { seedPhase, file, password: jsonPassword }: any = { ...formValues };

  const handleClick = async (password: string) => {
    const isValid = validatePassword(password);
    if (isValid) {
      try {
        if (file) {
          await importJson(file as KeyringPair$Json | KeyringPairs$Json | undefined, jsonPassword);
        } else {
          importViaSeed(seedPhase, password);
        }

        // saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
        goTo(Wallet);
      } catch (err: any) {
        // todo proper typing
        setIsSnackbarOpen(true);
        setSnackbarError(err.message);
      }
    } else {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid Password');
    }
  };

  return (
    <Container>
      <WizardHeader
        title={'IMPORT COMPLETE!'}
        onClose={() => {
          dispatch(reset('AddImportAccount'));
          goTo(Wallet);
        }}
        onBack={() => {
          dispatch(reset('AddImportAccount'));
          previousStep();
        }}
      />
      <Content>
        <IconContainer>
          <CheckMarkContainer>
            <CheckMarkIcon />
          </CheckMarkContainer>
          <Circle>
            <CircleInner />
          </Circle>
          <LockContainer>
            <LockIcon />
          </LockContainer>
        </IconContainer>
        <Title>To encrypt your new wallet please enter your password:</Title>
        <BottomContainer>
          {/* todo proper event typing */}
          <HumbleInput
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            bgColor=" #ececec"
            color="#434343"
            height="45px"
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            margin="10px 0 0 0"
            Icon={<RightArrow width={23} />}
            text={'Import'}
            onClick={() => handleClick(password)}
          />
        </BottomContainer>
        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="0px"
          bottom={'145px'}
        />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 40px;
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

const CircleInner = styled.div`
  width: 94%;
  height: 94%;
  background-color: #f8f8f8;
  border-radius: 100%;
`;

const CheckMarkContainer = styled.div`
  position: absolute;
  top: -15px;
  right: -20px;
`;

const LockContainer = styled.div`
  position: absolute;
  top: 70px;
`;

const Title = styled.div`
  text-align: center;
  color: #000;
  font-size: 17px;
  margin-top: 50px;
  font-family: 'SFCompactDisplayRegular';
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
