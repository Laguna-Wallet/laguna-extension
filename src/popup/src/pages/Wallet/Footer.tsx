import ActiveLightingIcon from 'assets/svgComponents/ActiveLightingIcon';
import ArrowsIcon from 'assets/svgComponents/ArrowsIcon';
import LightingIcon from 'assets/svgComponents/LightingIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import Activity from 'pages/Activity/Activity';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import Wallet from './Wallet';
import activeActivities from 'assets/imgs/activeActivities.png';

// todo move to enum
type Props = {
  activeItem?: 'wallet' | 'activity';
};

export default function Footer({ activeItem }: Props) {
  return (
    <Container>
      <StyledLink component={Wallet}>
        {activeItem === 'wallet' ? <WalletIcon fill="" /> : <WalletIcon fill="" />}
      </StyledLink>
      <StyledLink component={Wallet}>
        <ArrowsIcon />
      </StyledLink>
      <StyledLink component={Activity}>
        {activeItem === 'activity' ? (
          <ActiveActivities activeActivities={activeActivities} />
        ) : (
          <LightingIcon />
        )}
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

const ActiveActivities = styled.div<{ activeActivities: string }>`
  width: 12px;
  height: 20px;
  background-image: ${({ activeActivities }) => `url(${activeActivities})`};
  background-repeat: no-repeat;
  background-size: cover;
`;
