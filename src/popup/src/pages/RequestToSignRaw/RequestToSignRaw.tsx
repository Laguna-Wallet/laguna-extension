import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Button from 'components/primitives/Button';
import { useDispatch, useSelector } from 'react-redux';
import { changeDappAuthorization } from 'redux/actions';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import { CheckIcon } from '@heroicons/react/outline';
import { Messages } from 'utils/types';

export default function RequestToSignRaw() {
  const { pendingToSignRaw } = useSelector((state: any) => state.wallet);
  const dispatch = useDispatch();

  const pendingDapp = pendingToSignRaw;

  const handleApprove = () => {
    chrome.runtime.sendMessage({
      type: Messages.SignRawRequest,
      payload: { approved: true, pendingDapp }
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
    <Container bg={walletBG}>
      <Title>REQUEST TO SIGN</Title>
      <Icons>
        <IconContainer></IconContainer>
        <IconContainer></IconContainer>
      </Icons>

      <Content>
        <Text>This app would like to:</Text>
        <Text>
          <CheckContainer>
            <CheckIcon stroke="#62c660" width={25} height={25} />
          </CheckContainer>{' '}
          Make transaction from your account
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

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 15px 15px 40px 15px;
  flex-direction: column;
  background-color: #f1f1f1;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
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
  font-weight: 500;
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
  flex-direction: column;
  padding: 25px 0;
  box-sizing: border-box;
  border-top: 1px solid #b1b5c3;
  border-bottom: 1px solid #b1b5c3;
  margin-top: auto;
  font-family: 'SFCompactDisplayRegular';
`;

const Text = styled.div`
  display: flex;
  font-size: 16px;
  margin-bottom: 10px;
`;

const Warning = styled.div`
  font-size: 14px;
  margin-top: 32px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
