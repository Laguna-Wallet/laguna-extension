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
import encodeBg from 'assets/imgs/encode-bg.png';
import { useWizard } from 'react-use-wizard';

type Props = {
  handleEncode: (password: string) => void;
  onClose: () => void;
  onBack: (backAction: () => void) => void;
  title: string;
};

export default function EncodeAccount({ handleEncode, title, onClose, onBack }: Props) {
  const [password, setPassword] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const { nextStep, previousStep } = useWizard();

  const onClick = async (password: string) => {
    const isValid = validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid Password');
      return;
    }

    try {
      await handleEncode(password);
      nextStep();
      // goTo(Wallet);
    } catch (err: any) {
      // todo proper typing
      setIsSnackbarOpen(true);
      setSnackbarError(err.message);
    }
  };

  return (
    <Container bg={encodeBg}>
      <Content>
        <IconContainer>
          <CheckMarkIcon fill="#111" />
        </IconContainer>
        <Title>{title}</Title>
        <Description>To encrypt your new wallet please enter your password below:</Description>
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
            text={'Finish'}
            onClick={() => onClick(password)}
            justify="center"
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

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
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
  width: 167.3px;
  height: 167.3px;
  border-radius: 100%;
  background-color: #fff;
  box-shadow: 5px 5px 50px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: auto;
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
  font-size: 22px;
  margin-top: 28px;
  font-family: 'IBM Plex Sans';
  font-weight: 500;
  text-align: center;
  color: #18191a;
`;

const Description = styled.div`
  width: 251px;
  height: 38px;
  margin-top: 10px;
  font-family: Inter;
  font-size: 14px;
  text-align: center;
  color: #353945;
  margin-bottom: 40px;
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
