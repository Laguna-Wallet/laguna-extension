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
import RightArrow from 'assets/svgComponents/RightArrow';
import ExportTransactionIcon from 'assets/svgComponents/ExportTransactionIcon';
import { TokenSymbols, Transaction } from 'utils/types';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';

type Props = {
  transaction: Transaction;
  closeAction?: () => void;
};

export default function AccountInfo({ transaction, closeAction }: Props) {
  const { from, to, nonce, amount, fee, chain, hash } = transaction;
  const prices = useSelector((state: any) => state.wallet.prices);
  const price = prices[chain];

  const symbol = TokenSymbols[chain];

  const { tokenDecimals } = useSelector((state: any) => state?.wallet);

  const decimal = tokenDecimals[symbol.toUpperCase()];

  const onClick = (hash: string, chain: string) => {
    chrome.windows.create({ url: `https://${chain}.subscan.io/extrinsic/${hash}` });
  };

  const factor = new BigNumber(10).pow(decimal);
  const gasFee = new BigNumber(fee).dividedBy(factor);
  const total = new BigNumber(amount).plus(gasFee);
  const totalInUsd = price?.usd ? new BigNumber(total).multipliedBy(price?.usd) : new BigNumber(0);

  const csvData = [
    ['Confirmed', hash],
    ['From', from],
    ['To', to],
    ['Nonce', nonce],
    ['Amount', `${amount} ${symbol}`],
    ['Gas Fee', `${gasFee} ${symbol}`],
    ['Total', `${total} ${symbol}`],
    ['Total in currency', `${totalInUsd} usd`],
    ['Date', `${format(Number(transaction.timestamp) * 1000, 'dd/MMM/yyyy pp')}`]
  ];

  return (
    <Container>
      <ContentItem>
        <Title>
          <span>Receive</span>
          <CloseIconContainer onClick={() => (closeAction ? closeAction() : goTo(Activity))}>
            <CloseIcon stroke={'#111'} />
          </CloseIconContainer>
        </Title>
        <Row>
          <RowLeft>Status</RowLeft>
          <RowRight style={{ cursor: 'pointer' }} onClick={() => onClick(hash, chain)}>
            View on Polkadot explorer
          </RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft>Confirmed</RowLeft>
          <RowRight
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(hash);
            }}>
            Copy Transaction ID
          </RowRight>
        </Row>
        <Row marginTop="23px">
          <Direction>
            <span>From</span>
            <Address>{truncateString(from)}</Address>
          </Direction>
          <ArrowContainer>
            <RightArrow width={20} height={20} />
          </ArrowContainer>
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
        <Row marginTop="20px">
          <RowLeft>Nonce</RowLeft>
          <RowRight>{nonce}</RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft>Amount</RowLeft>
          <RowRight>
            {amount} {symbol}
          </RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft>Gas Fee</RowLeft>
          <RowRight>
            {gasFee.toFormat(4, 1)} {symbol}
          </RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft> Total</RowLeft>
          <RowRight>
            <TotalValue>
              <span>
                {total.toFormat(4, 1)} {symbol}
              </span>{' '}
              <span>${totalInUsd.toFormat(2)} USD</span>
            </TotalValue>
          </RowRight>
        </Row>
      </ContentItem>

      <ExportButton>
        <ExportTransactionIcon />
        <StyledCSVLink filename={'transaction.csv'} data={csvData}>
          <span>Export Transaction</span>
        </StyledCSVLink>
      </ExportButton>
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
  padding: 23px;
  box-sizing: border-box;
  overflow: hidden;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  :nth-child(2) {
    margin-top: 30px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  span {
    font-family: 'IBM Plex Sans';
    font-size: 17px;
    font-weight: 500;
    color: #18191a;
  }
  border-bottom: 1px solid #111;
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
`;

const Row = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ marginTop }) => marginTop || '15px'};
`;

const RowLeft = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  color: #18191a;
`;

const RowRight = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  color: #18191a;
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
  color: #18191a;
  :nth-child(2) {
    align-items: flex-end;
  }
  span {
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
  }
  :nth-child(2) {
    span {
      margin-left: auto;
    }
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: flex-end;
  svg {
    margin-top: 29px;
  }
`;

const Address = styled.div`
  font-size: 14px;
  color: #000000;
  font-family: SFCompactDisplayRegular;
  margin-top: 10px;
`;

const ExportButton = styled.div`
  width: 145px;
  height: 26px;
  background-color: #000000;
  border-radius: 20px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  font-family: 'IBM Plex Sans';
  font-size: 12px;

  span {
    margin-left: 5px;
  }
`;

const StyledCSVLink = styled(CSVLink)`
  color: #fff;
  text-decoration: none;
`;
