import ArrowsIcon from 'assets/svgComponents/ArrowsIcon';
import LightingIcon from 'assets/svgComponents/LightingIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import Activity from 'pages/Activity/Activity';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import Wallet from './Wallet';

type Props = {
  activeItem?: 'wallet' | 'activity';
};

export default function Footer({ activeItem }: Props) {
  return (
    <Container>
      <StyledLink component={Wallet}>
        <WalletIcon />
      </StyledLink>
      <StyledLink component={Wallet}>
        <ArrowsIcon />
      </StyledLink>
      <StyledLink component={Activity}>
        <LightingIcon />
      </StyledLink>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #111;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const StyledLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  span {
    font-family: 'Sequel100Wide55Wide';
    margin-left: 5px;
  }
`;
