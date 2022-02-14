import { useRef } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';
import SuccessfullySentIcon from 'assets/svgComponents/SuccesfullySentIcon';
import Button from 'components/primitives/Button';
import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import bg from '../../assets/imgs/transaction-sent.png';
import { useSelector } from 'react-redux';

export default function TransactionSent() {
  // todo proper typing
  const blockHash = useSelector((state: any) => state.sendToken.blockHash);

  const onClick = () => {
    chrome.windows.create({ url: `https://polkadot.js.org/apps/#/explorer/query/${blockHash}` });
  };

  return (
    <Container>
      <Content>
        <IconContainer bg={bg}>
          <SuccessfullySentIcon fill="#fff" />
        </IconContainer>
        <Text>TRANSACTION SENT</Text>
      </Content>
      <ButtonsContainer>
        <Button
          onClick={onClick}
          text="View on Blockchain"
          Icon={<RightArrow width={23} />}
          bgColor="#e2e2e2"
          color="#111"
          borderColor="#e2e2e2"
          justify="center"
        />
        <StyledLink component={Wallet}>
          <Button
            text="Continue"
            margin="5px 0 0 0"
            Icon={<RightArrow width={23} />}
            justify="center"
          />
        </StyledLink>
      </ButtonsContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-size: cover;
  padding-bottom: 38px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div<{ bg: string }>`
  width: 225px;
  height: 225px;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  margin-top: 10px;
  font-family: Sequel100Wide55Wide;
  font-size: 16px;
  letter-spacing: 0.8px;
  color: #313131;
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: auto;
  flex-direction: column;
  padding: 0 15px;
  box-sizing: border-box;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
