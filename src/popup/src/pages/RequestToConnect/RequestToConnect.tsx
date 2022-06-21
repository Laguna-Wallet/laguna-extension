import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Button from 'components/primitives/Button';
import { useDispatch, useSelector } from 'react-redux';
import { changeDappAuthorization } from 'redux/actions';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import { CheckIcon } from '@heroicons/react/outline';
import { Messages } from 'utils/types';
import browser from 'webextension-polyfill';

export default function RequestToConnect() {
  const { pendingDappAuthorization } = useSelector((state: any) => state.wallet);
  const dispatch = useDispatch();

  const pendingDapp = pendingDappAuthorization?.pendingDappAuthorization;
  const dappName = pendingDappAuthorization?.pendingDappAuthorization[0]?.request?.requestOrigin;

  const handleApprove = () => {
    browser.runtime.sendMessage({
      type: Messages.DappAuthRequest,
      payload: { approved: true, pendingDapp, POPUP_CONTENT: process.env.REACT_APP_POPUP_CONTENT }
    });

    dispatch(changeDappAuthorization({}));
    window.close();
  };

  const handleCancel = () => {
    browser.runtime.sendMessage({
      type: Messages.DappAuthRequest,
      payload: { approved: false, pendingDapp }
    });

    dispatch(changeDappAuthorization({}));
    window.close();
  };

  return (
    <Container>
      <Title>REQUEST TO CONNECT</Title>
      {/* <Icons>
        <IconContainer></IconContainer>
        <IconContainer></IconContainer>
      </Icons> */}

      <MainContent>
        <Text spacing="0.1em;" fWeight="600">
          Connect With
        </Text>
        <Text fSize="12px" marginTop="6px" color="#484848">
          {dappName}
        </Text>
      </MainContent>

      <Content>
        <Text fSize="14px">This app would like to:</Text>
        <Text fSize="14px" marginTop="10px">
          <CheckContainer>
            <CheckIcon stroke="#62c660" width={25} height={25} />
          </CheckContainer>{' '}
          View your wallet balance & activity
        </Text>
      </Content>

      <Warning>Warning: make transaction with trusted applications.</Warning>

      <ButtonContainer>
        <Button
          onClick={handleCancel}
          text="Cancel"
          color="#111"
          bgColor="#ececec"
          borderColor="#ececec"
          justify="center"
          margin="10px 0 0 0"
        />

        <Button
          onClick={handleApprove}
          text="Connect"
          color="#fff"
          bgColor="#111"
          borderColor="#111"
          justify="center"
          margin="10px 0 0 10px"
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 15px 15px 40px 15px;
  flex-direction: column;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
  padding-top: 50px;
  overflow: hidden;
  box-sizing: border-box;
`;

const Title = styled.div`
  width: 100%;
  height: 40px;
  font-family: 'IBMPlexSans';
  font-size: 17px;
  font-weight: 600;
  line-height: 2.35;
  letter-spacing: 1.7px;
  text-align: center;
  color: #18191a;
`;

const Icons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const IconContainer = styled.div`
  width: 115px;
  height: 115px;
  border-radius: 100%;
  background: #fff;
  &:nth-child(1) {
    margin-right: 30px;
  }
`;

const CheckContainer = styled.div`
  margin-right: 5px;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 102px;
  font-family: 'IBMPlexSans';
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 26px 0;
  box-sizing: border-box;
  border-top: 1px solid #b1b5c3;
  border-bottom: 1px solid #b1b5c3;
  margin-top: auto;
  font-family: 'IBMPlexSans';
`;

const Text = styled.div<{
  fWeight?: string;
  marginTop?: string;
  spacing?: string;
  fSize?: string;
  color?: string;
}>`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: ${({ marginTop }) => marginTop};
  font-weight: ${({ fWeight }) => fWeight || '400'};
  letter-spacing: ${({ spacing }) => spacing};
  font-size: ${({ fSize }) => fSize || '16px'};
  font-size: ${({ color }) => color || '#18191A'};
`;

const Warning = styled.div`
  text-align: center;
  font-size: 12px;
  margin-top: 32px;
  font-family: 'IBMPlexSans';
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 32px;
  /* margin-top: auto; */
`;
