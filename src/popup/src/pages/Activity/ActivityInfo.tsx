import styled from 'styled-components';
import { goTo } from 'react-chrome-extension-router';
import Activity from './Activity';
import { truncateString } from 'utils';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import ExportTransactionIcon from 'assets/svgComponents/ExportTransactionIcon';
import { TokenSymbols, Transaction } from 'utils/types';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import CloseArrowIcon from 'assets/svgComponents/CloseArrowIcon';
import RightBigArrowIcon from 'assets/svgComponents/RightBigArrowIcon';

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
            <CloseArrowIcon />
          </CloseIconContainer>
        </Title>
        <Line />
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
        <Row marginTop="28px">
          <Direction>
            <span>From</span>
            <span>To</span>
          </Direction>
        </Row>
        <Row marginTop="3px">
          <Direction>
            <Address>{truncateString(from)}</Address>
            <RightBigArrowIcon />
            <Address>{truncateString(to)}</Address>
          </Direction>
        </Row>
      </ContentItem>

      <ContentItem>
        <Title>
          <span>Transaction</span>
        </Title>
        <Line />
        <Row marginTop="20px">
          <RowLeft>Nonce</RowLeft>
          <RowRight>{nonce}</RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft>Amount</RowLeft>
          <RowRight>
            {amount} {symbol.toUpperCase()}
          </RowRight>
        </Row>
        <Row marginTop="8px">
          <RowLeft>Gas Fee</RowLeft>
          <RowRight>
            {gasFee.toFormat(4, 1)} {symbol.toUpperCase()}
          </RowRight>
        </Row>
        <Row marginTop="15px">
          <BoldText> Total</BoldText>
          <RowRight>
            <TotalValue>
              <BoldText fontSize="14px">
                {total.toFormat(4, 1)} {symbol.toUpperCase()}
              </BoldText>{' '}
              <BoldText fontSize="14px">${totalInUsd.toFormat(2)} USD</BoldText>
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
  padding: 20px 21px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 5px;
`;

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  :nth-child(2) {
    margin-top: 23px;
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  span {
    font-family: 'IBM Plex Sans';
    font-size: 17px;
    font-weight: 500;
    color: #18191a;
  }
`;

const Line = styled.div`
  width: 274px;
  height: 1px;
  margin: 6px 6px 0 0;
  background-color: #18191a;
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
  height: 24px;
`;

const Row = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 274px;
  width: 100%;
  margin-top: ${({ marginTop }) => marginTop || '15px'};
`;

const RowLeft = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  line-height: 1.35;
  color: #18191a;
`;

const BoldText = styled.div<{ fontSize?: string }>`
  font-family: Inter;
  font-size: ${({ fontSize }) => fontSize || '16px'};
  font-weight: 500;
  color: #18191a;
  line-height: 1.35;
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
  height: 38px;
  span {
    :nth-child(1) {
      font-weight: 600;
    }
  }
`;

const Direction = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #18191a;

  span {
    font-family: Inter;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.35;
  }
`;

const Address = styled.div`
  font-size: 12px;
  line-height: 1.35;
  color: #18191a;
  font-family: IBM Plex Sans;
`;

const ExportButton = styled.div`
  max-width: 143px;
  width: 100%;
  height: 24px;
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
  margin-top: 17px;
  line-height: 1.35 span {
    margin-left: 5px;
  }
`;

const StyledCSVLink = styled(CSVLink)`
  color: #fff;
  text-decoration: none;
`;
