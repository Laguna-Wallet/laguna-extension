import BigNumber from 'bignumber.js';
import NetworkIcons from 'components/primitives/NetworkIcons';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  accountAddress: string;
  // Todo Appropriate typing
  asset: Asset;
  handleClick?: () => void;
  iconSize?: string;
};

export default function ChainItem({ asset, handleClick, iconSize }: Props) {
  const { chain, symbol, balance, calculatedPrice } = asset;
  const iconCurrentSize = iconSize || '36px';
  return (
    // <StyledLink component={TokenDashboard} props={{ asset }}>
    <Container onClick={handleClick}>
      <ListItemIcon iconSize={iconSize}>
        <NetworkIcons
          width={iconCurrentSize}
          height={iconCurrentSize}
          isSmallIcon={!!iconSize}
          chain={chain}
        />
      </ListItemIcon>
      <ListItemText>
        <Title>{chain}</Title>
        <Tag>{chain} Chain</Tag>
      </ListItemText>
      <ListItemText>
        <Symbol>
          {balance ? new BigNumber(balance).toFormat(4, 1) : 0} {symbol}
        </Symbol>
        <Value>${calculatedPrice ? new BigNumber(calculatedPrice).toFixed(2) : 0}</Value>
      </ListItemText>
    </Container>
    // </StyledLink>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const Container = styled.div`
  width: 323px;
  height: 59px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 12px;
  padding: 14px 14px 14px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
`;

const ListItemIcon = styled.div<{ iconSize?: string }>`
  width: ${({ iconSize }) => iconSize || '36px'};
  height: ${({ iconSize }) => iconSize || '36px'};
  background-color: #eeeeee;
  border-radius: 100%;
`;

const ListItemText = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  text-align: left;
  font-family: 'IBM Plex Sans';
  font-size: 17px;
  font-weight: 500;

  :nth-child(3) {
    text-align: right;
    margin-left: auto;
  }
`;

const Title = styled.div`
  font-size: 17px;
  text-transform: capitalize;
  color: #000;
`;

const Symbol = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  color: #000;
`;

const Tag = styled.div`
  font-size: 10px;
  font-family: 'IBM Plex Sans';
  box-sizing: border-box;
  color: #777e90 !important;
  text-transform: capitalize;
`;

const Value = styled.div`
  font-size: 10px;
  font-family: 'IBM Plex Sans';
  color: #23262f;
  margin-top: 3px;
`;
