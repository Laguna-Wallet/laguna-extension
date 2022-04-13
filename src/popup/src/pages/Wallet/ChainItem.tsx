import BigNumber from 'bignumber.js';
import NetworkIcons from 'components/primitives/NetworkIcons';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { Asset } from 'utils/types';

type Props = {
  accountAddress: string;
  // Todo Appropriate typing
  asset: Asset;
  handleClick: () => void;
};

export default function ChainItem({ asset, accountAddress, handleClick }: Props) {
  return (
    // <StyledLink component={TokenDashboard} props={{ asset }}>
    <Container onClick={handleClick}>
      <ListItemIcon>
        <NetworkIcons width="36px" height="36px" chain={asset.chain} />
      </ListItemIcon>
      <ListItemText>
        <Title fs="17px">{asset.chain}</Title>
        <Tag>{asset.chain}</Tag>
      </ListItemText>
      <ListItemText>
        <Title fs="14px">
          {new BigNumber(asset?.balance).toFormat(4, 1) || 0} {asset.symbol}
        </Title>
        <Value>${new BigNumber(asset.calculatedPrice).toFixed(2)}</Value>
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
  margin-bottom: 10px;
  padding: 14px 12px;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;
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
  font-family: 'IBM Plex Sans';
  font-size: 17px;
  font-weight: 500;

  :nth-child(3) {
    text-align: right;
    margin-left: auto;
  }
`;

const Title = styled.div<{ fs: string }>`
  font-size: ${({ fs }) => fs || '17px'};
  text-transform: capitalize;
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
`;
