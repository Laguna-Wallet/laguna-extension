import BigNumber from 'bignumber.js';
import NetworkIcons from 'components/primitives/NetworkIcons';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  isMarketCap?: boolean;
  network: Asset
}

export default function NetworkItem({network, isMarketCap = false }: Props) {
  const {chain, assetsCount, calculatedPrice, marketCap} = network;
  
  return (
    <Container>
      <ListItemIcon>
        <NetworkIcons chain={chain} />
      </ListItemIcon>
      <ListItemText>
        <Title>{chain}</Title>
        <Tag>{assetsCount || 1} Asset</Tag>
      </ListItemText>
      <ListItemText>
        <Title>
          $ {!isMarketCap ?  (new BigNumber(calculatedPrice).toFormat(2, 1) || 0) :  (marketCap &&
            String(marketCap)
              .replace(/,/g, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0}
        </Title>
      </ListItemText>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 59px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 12px;
  padding: 14px 14px 14px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  font-family: 'Sequel100Wide55Wide';
`;

const ListItemIcon = styled.div`
  width: 36px;
  height: 36px;
  background-color: #eeeeee;
  border-radius: 100%;
`;

const ListItemText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  text-align: left;

  :nth-child(3) {
    text-align: right;
    margin-left: auto;
  }
`;

const Title = styled.div`
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
`;

const Tag = styled.div`
  font-size: 10px;
  color: #777e90;
  font-family: 'IBM Plex Sans';
  margin-top: 3px;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  font-family: 'IBM Plex Sans';
`;
