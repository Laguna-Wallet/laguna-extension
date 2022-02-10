import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { importJson, importViaSeed, validatePassword } from 'utils/polkadot';
import WizardHeader from './WizardHeader';

import { useWizard } from 'react-use-wizard';
import { saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import DiscordIcon from 'assets/svgComponents/DiscordIcon';
import TwitterIcon from 'assets/svgComponents/twitterIcon';

export default function EncodeAccount() {
  const [password, setPassword] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const { nextStep, previousStep } = useWizard();

  useEffect(() => {
    saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
  }, []);

  return (
    <Container>
      <WizardHeader title={'SETUP COMPLETE!!'} onClose={() => goTo(Wallet)} onBack={previousStep} />
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
        <Title>
          Connect with our community to stay up to date with feature updates and opportunities.
        </Title>
        <LinksContainer>
          <LinkContainer>
            <LinkIconContainer>
              <DiscordIcon width={22} height={22} />
            </LinkIconContainer>
            <span>Join our Discord</span>
          </LinkContainer>
          <LinkContainer>
            <LinkIconContainer>
              <TwitterIcon width={22} height={22} />
            </LinkIconContainer>
            <span>Follow us on Twitter</span>
          </LinkContainer>
        </LinksContainer>
        <BottomContainer>
          <Button
            type="button"
            justify="center"
            margin="10px 0 0 0"
            text={'Finish'}
            onClick={() => goTo(Wallet)}
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
  margin-top: 25px;
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

const LinksContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'SFCompactDisplayRegular';
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
`;

const LinkContainer = styled.div`
  width: 190px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ececec;
  border-radius: 25px;
  padding: 10px 16px;
  box-sizing: border-box;
  border-radius: 25px;
  margin-top: 10px;
  cursor: pointer;
  span {
    margin-right: auto;
  }
`;

const LinkIconContainer = styled.div`
  margin-right: auto;
`;

const BottomContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
