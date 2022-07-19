import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Button from 'components/primitives/Button';
import { useDispatch, useSelector } from 'react-redux';
import { changeDappAuthorization } from 'redux/actions';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import { CheckIcon } from '@heroicons/react/outline';
import { Messages } from 'utils/types';

export default function RequestToSignRaw() {
  const { pendingToSignRaw: pendingDapp } = useSelector((state: any) => state.wallet);
  console.log('~ pendingDapp', pendingDapp);
  const dispatch = useDispatch();

  const address = pendingDapp?.data?.request?.address;
  const dappName = pendingDapp?.data?.url;

  const handleApprove = () => {
    chrome.runtime.sendMessage({
      type: Messages.SignRawRequest,
      payload: { approved: true, pendingDapp, POPUP_CONTENT: process.env.REACT_APP_POPUP_CONTENT }
    });

    dispatch(changeDappAuthorization({}));
    window.close();
  };

  const handleCancel = () => {
    chrome.runtime.sendMessage({
      type: Messages.SignRawRequest,
      payload: { approved: false, pendingDapp }
    });

    dispatch(changeDappAuthorization({}));
    window.close();
  };

  return (
    <Container>
      <Title>REQUEST TO SIGN</Title>

      <Content>
        <Text spacing="2px" fWeight="600" fSize="17px">
          Connecting to
        </Text>
        <Text fSize="12px" marginTop="6px" color="#484848">
          {dappName && new URL(dappName).origin}
        </Text>
      </Content>

      <Warning>Would you like to sign this message?</Warning>

      <Message>Sign this message under the address ${address}</Message>

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
          text="Save"
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
  font-family: 'SFCompactDisplayRegular';
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
  margin-top: 15px;
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 0;
  font-family: 'IBMPlexSans';
  box-sizing: border-box;
  margin-top: auto;
`;

const Message = styled.div`
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
  padding: 25px 10px;
  font-size: 14px;
  line-height: 18.9px;
  margin-top: 14px;
  border-radius: 2px;
  word-wrap: break-word;
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
  font-size: 14px;
  margin-top: 32px;
  border-top: 1px solid #b1b5c4;
  padding-top: 14px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
