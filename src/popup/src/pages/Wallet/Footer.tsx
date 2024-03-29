import LightingIcon from 'assets/svgComponents/LightingIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { router } from 'router/router';

// todo move to enum
type Props = {
  activeItem?: 'wallet' | 'activity';
};

export default function Footer({ activeItem }: Props) {
  return (
    <Container>
      <StyledLink to={router.home}>
        {activeItem === 'wallet' ? (
          <WalletIcon stroke="#18191a" />
        ) : (
          <WalletIcon stroke="#b1b5c3" />
        )}
      </StyledLink>
      {/* <StyledLink component={Wallet}>
        <ArrowsIcon stroke="#b1b5c3" />
      </StyledLink> */}
      <StyledLink to={router.activity}>
        {activeItem === 'activity' ? <LightingIcon fill="#18191a" /> : <LightingIcon />}
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
  background-color: #fff;
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

// const ActiveActivities = styled.div<{ activeActivities: string }>`
//   width: 12px;
//   height: 20px;
//   background-image: ${({ activeActivities }) => `url(${activeActivities})`};
//   background-repeat: no-repeat;
//   background-size: cover;
// `;
