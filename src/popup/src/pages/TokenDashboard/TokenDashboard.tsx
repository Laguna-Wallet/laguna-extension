import Header from 'pages/Wallet/Header';
import styled from 'styled-components';
import { Asset, TokenInfo, Transaction } from 'utils/types';
import dashboardBG from 'assets/imgs/dashboard-bg.jpg';
import { useDispatch, useSelector } from 'react-redux';
import NetworkIcons from 'components/primitives/NetworkIcons';
import BigNumber from 'bignumber.js';
import { selectAsset } from 'redux/actions';
import { ActivityItem } from 'pages/Activity/Activity';
import { useEffect, useState } from 'react';
import { getLatestTransactionsForSingleChain } from 'utils/polkadot';
import { useAccount } from 'context/AccountContext';
import Footer from 'pages/Wallet/Footer';
import ReceiveIcon from 'assets/svgComponents/ReceiveIcon';
import SendIcon from 'assets/svgComponents/SendIIcon';
import Popup from 'components/Popup/Popup';
import ActivityInfo from 'pages/Activity/ActivityInfo';
import InactiveField from 'components/InactiveField/InactiveField';
import { useHistory, Link } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  asset?: Asset;
};

export default function TokenDashboard({ asset }: Props) {
  const dispatch = useDispatch();
  const account = useAccount();
  const history = useHistory();

  const currAccountAddress = account?.getActiveAccount()?.address;
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transaction, setTransaction] = useState<Transaction>();

  const {
    prices,
    infos,
    accountsBalances,
    loading: accountsChanging
  } = useSelector((state: any) => state.wallet);

  const chain = asset?.chain;
  // todo proper typeing
  const tokenInfo: TokenInfo = infos.find((item: TokenInfo) => item.id === chain);

  const price = tokenInfo?.current_price;
  const price_change_percentage_24h = tokenInfo?.price_change_percentage_24h;
  const symbol = asset?.symbol;
  const balance = accountsBalances?.balances[chain || 0];
  const balanceInUsd = price ? new BigNumber(balance).multipliedBy(price).toFormat(4) : 0;

  const negativeValue = String(price_change_percentage_24h).includes('-');
  const renderPusSymbol =
    !negativeValue &&
    !String(price_change_percentage_24h).includes('+') &&
    price_change_percentage_24h !== undefined &&
    '+';

  const handleSendRoute = () => {
    if (asset) {
      history.push({
        pathname: router.send,
        state: { propsFromTokenDashboard: { chain, fromTokenDashboard: true, asset } }
      });
      dispatch(selectAsset(asset));
    }
  };

  useEffect(() => {
    async function go() {
      if (chain) {
        const { transactions } = await getLatestTransactionsForSingleChain(
          currAccountAddress,
          chain,
          0,
          10
        );

        setTransactions(transactions);
      }
    }

    go();
  }, []);

  const handleChain = (chain: string) => {
    if (chain === 'polkadot') return 'Polkadot Main Network';
    return `${chain} Network`;
  };

  const handleClick = (transaction: Transaction) => {
    setIsPopupOpen(true);
    setTransaction(transaction);
  };

  return (
    <Container bg={dashboardBG}>
      <Header title={`${chain} Balance`} backAction={() => history.push(router.home)}></Header>
      <Content isEmpty={!balance}>
        {!balance ? (
          <InactiveField />
        ) : (
          <>
            <CardContainer>
              <Card>
                <Balance>
                  <NetworkIcons chain={chain || ''} />
                  <span>{new BigNumber(balance).toFormat(4, 1) || 0}</span>
                  <span>{symbol}</span>
                </Balance>
                <BalanceInUsd>${new BigNumber(balanceInUsd).toFixed(2)}</BalanceInUsd>
                <CardBottom>
                  <Tag>{handleChain(chain || '')}</Tag>
                  <Rate negativeValue={negativeValue}>
                    {renderPusSymbol}
                    {price_change_percentage_24h
                      ? new BigNumber(price_change_percentage_24h).toFormat(2)
                      : 0}
                    %
                  </Rate>
                </CardBottom>
              </Card>
            </CardContainer>
            <ButtonsContainer>
              <Button onClick={handleSendRoute}>
                <RightArrowContainer>
                  <SendIcon stroke="#111" />
                </RightArrowContainer>
                <span>Send</span>
              </Button>
              <StyledLink to={router.receive}>
                {/* props={{ propsFromTokenDashboard: { chain, fromTokenDashboard: true, asset } }}> */}
                <Button>
                  <BarcodeIconContainer>
                    <ReceiveIcon width={20} height={20} />
                  </BarcodeIconContainer>
                  <span>Receive</span>
                </Button>
              </StyledLink>
            </ButtonsContainer>
            <Transactions>
              <TransactionsHeader>
                <TransactionsTitle>ACTIVITY</TransactionsTitle>
                <TransactionsTitle
                  onClick={() => {
                    history.push({ pathname: router.chainActivity, state: { chain, asset } });
                  }}>
                  SEE ALL
                </TransactionsTitle>
              </TransactionsHeader>
              {transactions &&
                transactions
                  .slice(0, 2)
                  .map((transaction, index) => (
                    <ActivityItem
                      key={`chain-actvity-${transaction.chain}-${index}`}
                      transaction={transaction}
                      bgColor={'#f9fafb'}
                      onClick={() => handleClick(transaction)}
                    />
                  ))}
            </Transactions>
            {isPopupOpen && transaction && (
              <Popup justify="center" align="center" onClose={() => setIsPopupOpen(false)}>
                <ActivityContainer>
                  <ActivityInfo
                    closeAction={() => setIsPopupOpen(false)}
                    transaction={transaction}
                  />
                </ActivityContainer>
              </Popup>
            )}
          </>
        )}
        <Footer activeItem="wallet" />
      </Content>
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

const Content = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  height: 100%;
  margin-top: ${({ isEmpty }) => (isEmpty ? '38px' : '60px')};
  box-sizing: border-box;
`;

const CardContainer = styled.div`
  width: 100%;
  padding: 0px 15px 15px 15px;
  box-sizing: border-box;
`;

const Card = styled.div`
  width: 100%;
  height: 160px;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Balance = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Work Sans';
  text-transform: uppercase;
  font-size: 27px;
  font-weight: 600;
  line-height: 1.48;
  color: #18191a;
  margin-top: auto;

  span:nth-child(2) {
    margin-right: 5px;
    margin-left: 5px;
  }
`;

const BalanceInUsd = styled.div`
  font-family: Inter;
  font-size: 16px;
  line-height: 1.45;
  text-align: center;
  color: #777e90;
`;

const CardBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: auto;
`;

const Tag = styled.div`
  padding: 3px 10px;
  box-sizing: border-box;
  border-radius: 50px;
  text-transform: capitalize;
  background-image: linear-gradient(
    to right top,
    #d7cce2,
    #ddcde1,
    #e3cee0,
    #e8cfdf,
    #edd0dd,
    #f1d1db,
    #f4d2d8,
    #f6d4d6,
    #f8d6d3,
    #f8d8d0,
    #f7dbcd,
    #f5decc
  );
`;

const Rate = styled.div<{ negativeValue: boolean }>`
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  color: ${({ negativeValue }) => (!negativeValue ? '#45b26b' : '#606060')};
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  color: #fff;
  margin-top: 24px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  :nth-child(2) {
    margin-left: 10px;
  }
`;

const Button = styled.div`
  width: 112px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  background: #ffffff;
  color: #111;
  cursor: pointer;
  :nth-child(2) {
    margin-left: 10px;
  }
`;

const RightArrowContainer = styled.div`
  /* transform: rotate(-45deg); */
  /* margin-top: 3px; */
  margin-right: 5px;
`;

const BarcodeIconContainer = styled.div`
  margin-right: 5px;
`;

const Transactions = styled.div`
  width: 100%;
  height: 253px;
  flex-direction: column;
  background-color: #ffffff;
  border-top-left-radius: 14.8px;
  border-top-right-radius: 14.8px;
  margin-top: 20px;
  padding: 20px 15px 0px 15px;
  box-sizing: border-box;
`;

const TransactionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TransactionsTitle = styled.div`
  height: 14px;
  font-family: Inter;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.44;
  color: #18191a;
  :nth-child(2) {
    cursor: pointer;
  }
`;

const ActivityContainer = styled.div`
  width: 323px;
  height: 429px;
`;
