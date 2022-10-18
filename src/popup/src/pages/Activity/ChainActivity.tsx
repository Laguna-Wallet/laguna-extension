import styled from "styled-components";
import { useAccount } from "context/AccountContext";
import activityBg from "assets/imgs/activity-bg.png";
import Header from "pages/Wallet/Header";
import Footer from "pages/Wallet/Footer";
import { getLatestTransactionsForSingleChain } from "utils/polkadot";
import { useEffect, useState } from "react";
import ActivityInfo from "./ActivityInfo";
import { useSelector } from "react-redux";
import { Asset, Transaction } from "utils/types";
import Popup from "components/Popup/Popup";
import { ActivityItem } from "./Activity";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom";
import { router } from "router/router";

type LocationState = {
  chain?: string;
  asset?: Asset;
};

export default function ChainActivity() {
  const account = useAccount();
  const history = useHistory();

  const location = useLocation<LocationState>();
  const { chain, asset } = location.state || {};

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
      if (chain) {
        const { transactions, count }: { count: number; transactions: Transaction[] } =
          await getLatestTransactionsForSingleChain(address, chain, asset?.symbol as string, 0, 10);

        setTransactions(transactions);
        setCount(count);
        setLoading(false);
      }
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
    if (chain) {
      const { transactions, count }: { count: number; transactions: Transaction[] } =
        await getLatestTransactionsForSingleChain(
          address,
          chain,
          asset?.symbol as string,
          page,
          10,
        );
      setTransactions((prev) => [...prev, ...transactions]);
      setLoading(false);
      setPage((prev) => prev + 1);
    }
  };

  return (
    <Container bg={activityBg}>
      <Header
        title={`${chain}  Activity`}
        backAction={() => {
          history.push({ pathname: router.tokenDashboard, state: { asset } });
        }}
      />

      <Content>
        <div
          id="scrollableDiv"
          style={{
            width: "100%",
            height: 420,
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            marginTop: 50,
          }}>
          <InfiniteScroll
            dataLength={transactions.length}
            next={fetchMoreData}
            hasMore={count !== transactions.length}
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
            scrollableTarget="scrollableDiv"
            loader={<h4>Loading...</h4>}>
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

  .infinite-scroll-component__outerdiv {
    width: 100%;
  }
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
  background-color: ${({ bgColor }) => bgColor || "#fff"};
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
  font-family: "IBM Plex Sans";
  font-size: 14px;
  font-weight: 500;
  color: #18191a;

  span {
    text-transform: capitalize;
  }
`;

const InfoBottom = styled.div`
  font-family: "IBM Plex Sans";
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
