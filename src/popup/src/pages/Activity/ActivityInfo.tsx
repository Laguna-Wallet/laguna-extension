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
import CloseIcon from 'assets/svgComponents/CloseIcon';
import Activity from './Activity';
import { truncateString } from 'utils';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import BN from 'bn.js';

type Props = {
  transaction?: any;
};

export default function AccountInfo({ transaction }: Props) {
  const { from, to, nonce, amount, fee, chain, hash } = transaction;
  const prices = useSelector((state: any) => state.wallet.prices);
  const price = prices[chain];

  const onClick = (hash: any) => {
    chrome.windows.create({ url: `https://polkadot.js.org/apps/#/explorer/query/${hash}` });
  };

  const factor = new BigNumber(10).pow(10);

  const calculatedFee = new BigNumber(new BN(fee).muln(110).divn(100).toNumber())
    .div(factor)
    .toFixed(4);

  return (
    <Container>
      <ContentItem>
        <Title>
          <span>Recieve</span>
          <CloseIconContainer onClick={() => goTo(Activity)}>
            <CloseIcon stroke={'#111'} />
          </CloseIconContainer>
        </Title>
        <Row>
          <RowLeft>Status</RowLeft>
          <RowRight style={{ cursor: 'pointer' }} onClick={() => onClick(hash)}>
            View on Polkadot explorer
          </RowRight>
        </Row>
        <Row>
          <RowLeft>Confirmed</RowLeft>
          <RowRight
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(hash);
            }}>
            Copy Transaction ID
          </RowRight>
        </Row>
        <Row>
          <Direction>
            <span>From</span>
            <Address>{truncateString(from)}</Address>
          </Direction>
          <Direction>
            <span>To</span>
            <Address>{truncateString(to)}</Address>
          </Direction>
        </Row>
      </ContentItem>

      <ContentItem>
        <Title>
          <span>Transaction</span>
        </Title>
        <Row>
          <RowLeft>Nonce</RowLeft>
          <RowRight>{nonce}</RowRight>
        </Row>
        <Row>
          <RowLeft>Amount</RowLeft>
          <RowRight>{amount}</RowRight>
        </Row>
        <Row>
          <RowLeft>Gas Fee</RowLeft>
          <RowRight>
            {new BigNumber(new BN(fee).muln(110).divn(100).toNumber()).div(factor).toFixed(4)}
          </RowRight>
        </Row>
        <Row>
          <RowLeft> Total</RowLeft>
          <RowRight>
            <TotalValue>
              <span> {calculatedFee}</span>{' '}
              {/* <span>{new BigNumber(Number(calculatedFee) + Number(amount)).toFixed(4)} USD</span> */}
            </TotalValue>
          </RowRight>
        </Row>
      </ContentItem>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  position: relative;
  background-size: cover;
  padding: 15px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  :nth-child(2) {
    margin-top: 50px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  span {
    font-size: 17px;
    color: #000000;
    font-family: 'Sequel100Wide55Wide';
  }
  border-bottom: 1px solid #111;
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const RowLeft = styled.span`
  font-family: SFCompactDisplayRegular;
  font-size: 16px;
  font-weight: 600;
`;

const RowRight = styled.span`
  font-family: SFCompactDisplayRegular;
  font-size: 14px;
`;

const TotalValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  span {
    :nth-child(1) {
      font-weight: 600;
    }
  }
`;

const Direction = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-family: SFCompactDisplayRegular;
    font-size: 16px;
    font-weight: 600;
  }
  :nth-child(2) {
    span {
      margin-left: auto;
    }
  }
`;

const Address = styled.div`
  font-size: 14px;
  color: #000000;
  font-family: SFCompactDisplayRegular;
  margin-top: 10px;
`;
