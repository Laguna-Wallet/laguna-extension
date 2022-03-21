import Header from 'pages/Wallet/Header';
import styled from 'styled-components';
import { Asset, TokenInfo } from 'utils/types';
import dashboardBG from 'assets/imgs/dashboard-bg.png';
import { goTo, Link } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { useSelector } from 'react-redux';
import NetworkIcons from 'components/primitives/NetworkIcons';
import BigNumber from 'bignumber.js';
import RightArrow from 'assets/svgComponents/RightArrow';
import Send from 'pages/Send/Send';
import Receive from 'pages/Recieve/Receive';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';

type Props = {
  asset: Asset;
};

export default function TokenDashboard({ asset }: Props) {
  const {
    prices,
    infos,
    accountsBalances,
    loading: accountsChanging
  } = useSelector((state: any) => state.wallet);

  const chain = asset.chain;
  // todo proper typeing
  const tokenInfo: TokenInfo = infos.find((item: TokenInfo) => item.id === chain);

  const price = tokenInfo?.current_price;
  const symbol = asset.symbol;
  const balance = accountsBalances?.balances[chain];
  const balanceInUsd = price ? new BigNumber(balance).multipliedBy(price).toFormat(4) : 0;

  return (
    <Container bg={dashboardBG}>
      <Header title={`${chain} Balance`} backAction={() => goTo(Wallet)}></Header>
      <Content>
        <Card>
          <Balance>
            <NetworkIcons chain={chain} />
            <span>{new BigNumber(balance).toFormat(4)}</span>
            <span>{symbol}</span>
          </Balance>
          <BalanceInUsd>${balanceInUsd}</BalanceInUsd>
          <CardBottom>
            <Tag>Polkadot Main Network</Tag>
            <Rate>+ 8.34%</Rate>
          </CardBottom>
        </Card>
        <ButtonsContainer>
          <StyledLink
            component={Send}
            props={{ propsFromTokenDashboard: { chain, fromTokenDashboard: true, asset } }}>
            <Button>
              <RightArrowContainer>
                <RightArrow width={20} height={20} stroke="#111" />
              </RightArrowContainer>
              <span>Send</span>
            </Button>
          </StyledLink>
          <StyledLink
            component={Receive}
            props={{ propsFromTokenDashboard: { chain, fromTokenDashboard: true, asset } }}>
            <Button>
              <BarcodeIconContainer>
                <BarcodeIcon />
              </BarcodeIconContainer>
              <span>Recieve</span>
            </Button>
          </StyledLink>
        </ButtonsContainer>
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

const Content = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 60px;
  padding: 0 15px 15px 15px;
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

const Rate = styled.div`
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  color: #45b26b;
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
  transform: rotate(-45deg);
  margin-top: 3px;
`;

const BarcodeIconContainer = styled.div`
  margin-top: 3px;
  margin-right: 5px;
`;
