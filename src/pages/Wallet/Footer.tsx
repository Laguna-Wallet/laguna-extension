import ArrowsIcon from 'assets/svgComponents/ArrowsIcon';
import LightingIcon from 'assets/svgComponents/LightingIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import styled from 'styled-components';

export default function Footer() {
  return (
    <Container>
      <FooterItem>
        <WalletIcon /> <span> Wallet </span>
      </FooterItem>
      <FooterItem>
        <ArrowsIcon />
      </FooterItem>
      <FooterItem>
        <LightingIcon />
      </FooterItem>
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

const FooterItem = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  span {
    font-family: 'Sequel100Wide55Wide';
    margin-left: 5px;
  }
`;
