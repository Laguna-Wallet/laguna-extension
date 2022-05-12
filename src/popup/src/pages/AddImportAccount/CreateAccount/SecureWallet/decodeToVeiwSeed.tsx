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
import encodeBg from 'assets/imgs/encode-bg.png';
import { useWizard } from 'react-use-wizard';
import { State } from 'redux/store';
import { useAccount } from 'context/AccountContext';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

type Props = {
  handleEncode: (password: string) => void;
  onClose: () => void;
  onBack: (backAction: () => void) => void;
  title: string;
};

export default function DecodeToViewSeed({ handleEncode, title, onClose, onBack }: any) {
  const { nextStep } = useWizard();
  const account = useAccount();

  const [password, setPassword] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const onClick = async (password: string) => {
    const isValid = await validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid Password');
      return;
    }

    try {
      const decodedSeed = AES.decrypt(
        account.getActiveAccount()?.meta?.encodedSeed as string,
        password
      );

      account.setMnemonics(decodedSeed.toString(Utf8).split(' '));

      nextStep();
    } catch (err: any) {
      // todo proper typing
      console.log(err);
      setIsSnackbarOpen(true);
      setSnackbarError(err.message);
    }
  };

  return (
    <Container bg={encodeBg}>
      <Content>
        <Description>To proceed with backing up, please enter your password:</Description>
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
            text={'Next'}
            onClick={() => onClick(password)}
            justify="center"
          />
        </BottomContainer>
        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="26px"
          bottom={'90px'}
          transform='translateX(0)'
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
`;

const Description = styled.div`
  height: 38px;
  font-family: Inter;
  font-size: 14px;
  text-align: left;
  color: #353945;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: auto;
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* margin-top: auto; */
`;
