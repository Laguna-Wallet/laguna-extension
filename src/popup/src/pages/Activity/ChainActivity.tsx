import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import activityBg from 'assets/imgs/activity-bg.png';
import Header from 'pages/Wallet/Header';
import Footer from 'pages/Wallet/Footer';
import { goTo, Link } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { getApiInstance, getLatestTransactionsForSingleChain } from 'utils/polkadot';
import { useEffect, useState } from 'react';
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
import { Asset, TokenSymbols, Transaction } from 'utils/types';
import { fetchAccountsTransactions } from 'utils/fetchTransactions';
import Popup from 'components/Popup/Popup';
import { ActivityItem } from './Activity';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import InfiniteScroll from 'react-infinite-scroll-component';

type Props = {
  chain: string;
  asset: Asset;
};

export default function ChainActivity({ chain, asset }: Props) {
  const account = useAccount();

  const wallet = useSelector((state: any) => state.wallet);
  // const transactions = wallet?.transactions[account.getActiveAccount().address];
  const [transactions, setTransactions] = useState<Transaction[] | []>([]);
  const [transaction, setTransaction] = useState<Transaction>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const address = account.getActiveAccount()?.address;

  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0);

  //   const sortedTransactions =
  //     transactions &&
  //     transactions.sort(
  //       (a: any, b: any) => (new Date(b.timestamp) as any) - (new Date(a.timestamp) as any)
  //     );

  useEffect(() => {
    async function go() {
      if (!address) return;
      setLoading(true);
      const { transactions, count }: { count: number; transactions: Transaction[] } =
        await getLatestTransactionsForSingleChain(address, chain, 0, 10);

      setTransactions(transactions);
      setCount(count);
      setLoading(false);
    }

    go();
  }, [address]);

  const handleClick = (transaction: Transaction) => {
    setIsPopupOpen(true);
    setTransaction(transaction);
  };

  const fetchMoreData = async () => {
    if (!address) return;

    setLoading(true);
    const { transactions, count }: { count: number; transactions: Transaction[] } =
      await getLatestTransactionsForSingleChain(address, chain, page, 10);
    setTransactions((prev) => [...prev, ...transactions]);
    setLoading(false);
    setPage((prev) => prev + 1);
  };

  return (
    <Container bg={activityBg}>
      <Header
        title={`${chain}  Activity`}
        backAction={() => {
          goTo(TokenDashboard, { asset });
        }}
      />

      <Content>
        <div
          id="scrollableDiv"
          style={{
            width: '100%',
            height: 420,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            marginTop: 50
          }}>
          <InfiniteScroll
            dataLength={transactions.length}
            next={fetchMoreData}
            hasMore={count !== transactions.length}
            style={{ display: 'flex', flexDirection: 'column' }}
            scrollableTarget="scrollableDiv"
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ marginTop: '5px', textAlign: 'center' }}>
                {!loading && <b>No more items</b>}
              </p>
            }>
            {transactions &&
              transactions.map((transaction: any) => {
                return (
                  <ActivityItem
                    key={`${transaction.hex}-index-${Math.random()}`}
                    onClick={() => handleClick(transaction)}
                    transaction={transaction}
                  />
                );
              })}
          </InfiniteScroll>
        </div>

        {/* {!loading ? (
          <ActivityItemsContainer>
            {transactions &&
              transactions.map((transaction: any) => {
                return (
                  <ActivityItem
                    onClick={() => handleClick(transaction)}
                    key={transaction.hex}
                    transaction={transaction}
                  />
                );
              })}
          </ActivityItemsContainer>
        ) : (
          <Loading>Loading...</Loading>
        )} */}
      </Content>

      {isPopupOpen && transaction && (
        <Popup justify="center" align="center" onClose={() => setIsPopupOpen(false)}>
          <ActivityContainer>
            <ActivityInfo closeAction={() => setIsPopupOpen(false)} transaction={transaction} />
          </ActivityContainer>
        </Popup>
      )}

      <Footer activeItem="wallet" />
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
  /* height: 500px; */
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

const Loading = styled.div`
  margin-top: 90px;
`;

const ActivityItemContainer = styled.div<{ bgColor?: string }>`
  width: 100%;
  height: 60px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  text-decoration: none;
  background-color: ${({ bgColor }) => bgColor || '#fff'};
  border-radius: 4px;
  cursor: pointer;
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
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  font-weight: 500;
  color: #18191a;

  span {
    text-transform: capitalize;
  }
`;

const InfoBottom = styled.div`
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  color: #777e90;
`;

const Actions = styled.div`
  cursor: pointer;
  margin-left: auto;
`;

const ActivityContainer = styled.div`
  width: 323px;
  height: 429px;
`;
