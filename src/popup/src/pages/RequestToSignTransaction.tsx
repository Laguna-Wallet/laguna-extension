import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Button from 'components/primitives/Button';
import { useDispatch, useSelector } from 'react-redux';
import { changeDappAuthorization, changePendingToSign } from 'redux/actions';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import { CheckIcon } from '@heroicons/react/outline';
import { Messages } from 'utils/types';

export default function RequestToSignTransaction() {
  const { pendingToSign } = useSelector((state: any) => state.wallet);
  const dispatch = useDispatch();
  const dappName = pendingToSign?.data?.url;

  const handleApprove = () => {
    chrome.runtime.sendMessage({
      type: Messages.SignRequest,
      payload: {
        approved: true,
        data: pendingToSign,
        POPUP_CONTENT: process.env.REACT_APP_POPUP_CONTENT
      }
    });

    dispatch(changePendingToSign({}));

    window.close();
  };

  const handleCancel = () => {
    chrome.runtime.sendMessage({
      type: Messages.SignRequest,
      payload: { approved: false, data: pendingToSign }
    });

    dispatch(changePendingToSign({}));

    window.close();
  };

  return (
    <Container>
      <Title>APPROVE TRANSACTION</Title>

      <Content>
        <Text spacing="2px" fWeight="600" fSize="17px">
          Give permission to access your asset on
        </Text>
        <Text fSize="12px" marginTop="6px" color="#484848">
          {new URL(dappName).origin}
        </Text>
      </Content>

      <Warning>Warning: Only approve transaction on trusted applications.</Warning>

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
          text="Approve"
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

const CheckContainer = styled.div`
  margin-right: 5px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 25px 0;
  box-sizing: border-box;
  margin-top: auto;
  font-family: 'IBMPlexSans';
  text-align: center;
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
  font-size: 12px;
  margin-top: auto;
  font-family: 'IBMPlexSans';
  text-align: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 32px;
`;
