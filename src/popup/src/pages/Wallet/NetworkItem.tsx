import NetworkIcons from 'components/primitives/NetworkIcons';
import styled from 'styled-components';

type Props = {
  network: any;
};

export default function NetworkItem({ network }: Props) {
  return (
    <Container>
      <ListItemIcon>
        <NetworkIcons chain={network.chain} />
      </ListItemIcon>
      <ListItemText>
        <Title>{network.chain}</Title>
        <Tag>1 Asset</Tag>
      </ListItemText>
      <ListItemText>
        <Title>
          $
          {network?.marketCap &&
            String(network.marketCap)
              .replace(/,/g, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Title>
        <Value>
          {' '}
          {network?.price_change_percentage_24h &&
            `${Number(network?.price_change_percentage_24h).toFixed(2)}%`}
        </Value>
      </ListItemText>
    </Container>
  );
}

const Container = styled.div`
  width: 99%;
  height: 59px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 10px;
  padding: 14px 12px;
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
