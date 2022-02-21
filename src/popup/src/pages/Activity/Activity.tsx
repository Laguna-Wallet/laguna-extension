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
import { useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { truncateString } from 'utils';
import { format, compareAsc } from 'date-fns';
import RightArrow from 'assets/svgComponents/RightArrow';
import { PlusIcon } from '@heroicons/react/outline';
import PolkadotLogoIcon from 'assets/svgComponents/PolkadotLogoIcon';
import KusamaLogoIcon from 'assets/svgComponents/KusamaLogoIcon';
import KusamaIcon from 'assets/svgComponents/KusamaIcon';
import { TokenSymbols, Transaction } from 'utils/types';

type Props = {
  isMenuOpen?: boolean;
  transaction: Transaction;
};

const Row = ({ transaction }: Props) => {
  const account = useAccount();

  const handleIsSent = (accountAddress: string, from: string) => {
    if (accountAddress === from) return true;
    return false;
  };

  const currAccountAddress = account.getActiveAccount().address;

  const isSent = handleIsSent(currAccountAddress, transaction.from);
  return (
    <ActivityItem>
      <StyledLink component={ActivityInfo} props={{ transaction }}>
        <Icon>
          {handleIcons(transaction.chain)}
          {isSent ? (
            <IconContainer bgColor="#0324ff">
              <RightArrow width={15} stroke="#fff" />
            </IconContainer>
          ) : (
            <IconContainer bgColor="#b9e260">
              <PlusIcon width={15} stroke="#fff" />
            </IconContainer>
          )}
        </Icon>
        <Info>
          <InfoTop>
            {transaction.amount} <span>{TokenSymbols[transaction?.chain]} </span>{' '}
          </InfoTop>
          <InfoBottom>
            {isSent
              ? 'to ' + truncateString(transaction.to)
              : 'from ' + truncateString(transaction.from)}
            {'  '} {format(new Date(transaction.timestamp), 'dd MMM yyyy')}
          </InfoBottom>
        </Info>
        <Actions>
          <ThreeDotsIcon />
        </Actions>
      </StyledLink>
    </ActivityItem>
  );
};

export default function Activity() {
  const account = useAccount();

  const wallet = useSelector((state: any) => state.wallet);
  const transactions = wallet?.transactions[account.getActiveAccount().address];

  const sortedTransactions =
    transactions &&
    transactions.sort(
      (a: any, b: any) => (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any)
    );

  return (
    <Container bg={walletBG}>
      <Header title="Activity" />

      <Content>
        <ActivityItemsContainer>
          {sortedTransactions.map((transaction: any) => {
            return <Row key={transaction.hex} transaction={transaction} />;
          })}
        </ActivityItemsContainer>
      </Content>

      <Footer activeItem="activity" />
    </Container>
  );
}

function handleIcons(chain: any) {
  switch (chain) {
    case 'westend':
      return <PolkadotLogoIcon width={20} height={20} />;
      break;
    case 'polkadot':
      return <PolkadotLogoIcon width={20} height={20} />;
      break;
    case 'kusama':
      return <KusamaLogoIcon fill="#111" stroke="#111" />;
      break;
    default:
  }
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
  padding-bottom: 50px;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
`;

const ActivityItemsContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-top: 75px;
  padding-bottom: 20px;
`;

const ActivityItem = styled.div`
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div<{ bgColor?: string }>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${({ bgColor }) => bgColor};
  position: absolute;
  bottom: -4px;
  right: -4px;
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
  span {
    text-transform: capitalize;
  }
`;

const InfoBottom = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #757575;
`;

const Actions = styled.div`
  cursor: pointer;
  margin-left: auto;
`;
