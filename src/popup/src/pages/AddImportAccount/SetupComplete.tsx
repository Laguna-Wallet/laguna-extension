import styled from 'styled-components';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

import Button from 'components/primitives/Button';

import { SnackbarMessages } from 'utils/types';
import DiscordIcon from 'assets/svgComponents/DiscordIcon';
import TwitterIcon from 'assets/svgComponents/twitterIcon';
import Bg from '../../assets/imgs/SetupCompleted-bg.jpg';
import { reduxForm } from 'redux-form';
import { useEnterClickListener } from 'hooks/useEnterClickListener';

function SetupComplete() {
  const history = useHistory();

  useEnterClickListener(
    () =>
      history.push({
        pathname: router.home,
        state: { snackbar: { show: true, message: SnackbarMessages.WalletCreated } }
      }),
    []
  );

  return (
    <Container bg={Bg}>
      <Content>
        <IconContainer>
          <Circle>
            <CheckMarkContainer>
              <CheckMarkIcon />
            </CheckMarkContainer>
          </Circle>
        </IconContainer>
        <Heading>Setup Complete!</Heading>

        <Title>
          Connect with our community to stay up to date with feature updates and opportunities.
        </Title>
        <LinksContainer>
          <LinkContainer>
            <a target="_blank" href="https://discord.com/invite/pWT49HTJJu" rel="noreferrer">
              <LinkIconContainer>
                <DiscordIcon width={22} height={22} />
              </LinkIconContainer>
              <span>Join our Discord</span>
            </a>
          </LinkContainer>
          <LinkContainer>
            <a target="_blank" href="https://twitter.com/lagunalabs" rel="noreferrer">
              <LinkIconContainer>
                <TwitterIcon width={22} height={22} />
              </LinkIconContainer>
              <span>Follow us on Twitter</span>
            </a>
          </LinkContainer>
        </LinksContainer>
        <BottomSection>
          <Button
            onClick={() =>
              history.push({
                pathname: router.home,
                state: { snackbar: { show: true, message: SnackbarMessages.WalletCreated } }
              })
            }
            type="button"
            justify="center"
            margin="10px 0 0 0"
            text={'Finish'}
          />
        </BottomSection>
      </Content>
    </Container>
  );
}

export default reduxForm<Record<string, unknown>, Record<string, unknown>>({
  form: 'SetupComplete',
  destroyOnUnmount: false
})(SetupComplete);

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding: 57px 26px 29px;
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
  line-height: 1.82;
  letter-spacing: 0.85px;
  text-align: center;
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
  color: #18191a;
  margin-right: auto;
  margin-top: 35.7px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Circle = styled.div`
  width: 167px;
  height: 167px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 100%;
`;

const CheckMarkContainer = styled.div``;

const Title = styled.div`
  text-align: center;
  max-width: 287px;
  width: 100%;
  margin-top: 10px;
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
  font-family: 'Inter';
  font-size: 14px;
  font-weight: 600;
  margin-top: 21px;
`;

const LinkContainer = styled.div`
  width: 199px;
  height: 39px;
  display: flex;

  background-color: #e6e8ec;
  box-sizing: border-box;
  border-radius: 25px;
  margin-top: 13px;
  cursor: pointer;

  a {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #fff;
  }

  span {
    font-family: Inter;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.71;
    color: #000;
  }
`;

const LinkIconContainer = styled.div`
  margin-right: 12px;
  height: 20px;
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
