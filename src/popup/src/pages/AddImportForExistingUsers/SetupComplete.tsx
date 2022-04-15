import styled from 'styled-components';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import Button from 'components/primitives/Button';
import Snackbar from 'components/Snackbar/Snackbar';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { goTo } from 'react-chrome-extension-router';

import { saveToStorage } from 'utils/chrome';
import { SnackbarMessages, StorageKeys } from 'utils/types';
import DiscordIcon from 'assets/svgComponents/DiscordIcon';
import TwitterIcon from 'assets/svgComponents/twitterIcon';
import Bg from '../../assets/imgs/SetupCompleted-bg.jpg';

export default function EncodeAccount() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  useEffect(() => {
    saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
    saveToStorage({ key: StorageKeys.OnBoarding, value: 'true' });
  }, []);

  return (
    <Container bg={Bg}>
      {/* <WizardHeader title={'SETUP COMPLETE!!'} onClose={() => goTo(Wallet)} onBack={previousStep} /> */}
      <Content>
        <IconContainer>
          <Circle>
            <CheckMarkContainer>
              <CheckMarkIcon />
            </CheckMarkContainer>
          </Circle>
        </IconContainer>
        <Heading>Setup Complete !</Heading>

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
            onClick={() =>
              goTo(Wallet, { snackbar: { show: true, message: SnackbarMessages.WalletCreated } })
            }
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

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding: 40px 16px 38px 16px;
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

const Heading = styled.div`
  width: 100%;
  line-height: 1.45;
  letter-spacing: 0.85px;
  text-align: center;
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
  color: #18191a;
  margin-right: auto;
  margin-top: 35px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Circle = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 100%;
`;

const CheckMarkContainer = styled.div``;

const Title = styled.div`
  width: 80%;
  text-align: center;
  font-size: 17px;
  margin-top: 15px;
  font-family: Inter;
  font-size: 14px;
  line-height: 1.35;
  text-align: center;
  color: #353945;
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
