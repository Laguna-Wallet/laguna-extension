import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import walletBG from 'assets/imgs/walletBG.jpg';
import Header from 'pages/Wallet/Header';
import Footer from 'pages/Wallet/Footer';
import { goTo, Link } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { getApiInstance } from 'utils/polkadot';
import { useEffect } from 'react';
import ThreeDotsIcon from 'assets/svgComponents/ThreeDotsIcon';
import ActivityInfo from './ActivityInfo';

type Props = {
  isMenuOpen?: boolean;
};

export default function Activity() {
  const account = useAccount();

  // useEffect(() => {
  // async function go() {
  //   const api = await getApiInstance('westend');
  //   console.log('~ api', api);
  //   const blocks = api.query.transactionStorage.blockTransactions;
  //   console.log(blocks);
  // }

  // go();
  // }, []);

  return (
    <Container bg={walletBG}>
      <Header title="Activity" />

      <Content>
        <ActivityItemsContainer>
          <ActivityItem>
            <StyledLink component={ActivityInfo}>
              <Icon></Icon>
              <Info>
                <InfoTop>33.11 Dot</InfoTop>
                <InfoBottom>to H32x...3Df</InfoBottom>
              </Info>
              <Actions>
                <ThreeDotsIcon />
              </Actions>
            </StyledLink>
          </ActivityItem>
        </ActivityItemsContainer>
      </Content>

      <Footer activeItem="activity" />
    </Container>
  );
}

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-top: 50px;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
`;

const ActivityItemsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 75px;
`;

const ActivityItem = styled.div`
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  cursor: pointer;
  text-decoration: none;
`;

const Icon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: #eeeeee;
`;

const Info = styled.span`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const InfoTop = styled.span`
  font-size: 14px;
  color: #000000;
  font-family: 'Sequel100Wide55Wide';
`;

const InfoBottom = styled.div`
  font-size: 12px;
  color: #757575;
`;

const Actions = styled.div`
  cursor: pointer;
  margin-left: auto;
`;
