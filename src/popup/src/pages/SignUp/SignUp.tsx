import Button from 'components/primitives/Button';
import CreateAccount from 'pages/AddImportAccount/CreateAccount/CreateAccount';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';

import signUpBg from 'assets/imgs/sign-up-bg.png';
import mainLogoSvg from 'assets/imgs/main-logo-white.svg';
import ImportAccount from 'pages/AddImportAccount/ImportAccount/ImportAccount';

// import ImportAccount from 'pages/AddImportAccount/ImportAccount';

export default function SignUp() {
  return (
    <PageContainer bgImage={signUpBg}>
      <IconSection>
        <IconContainer img={mainLogoSvg}>{/* <DonutIcon /> */}</IconContainer>
      </IconSection>
      <MainSection>
        <Title>Laguna</Title>
        <Description>Unlock the Power of Polkadot</Description>
        <StyledLink component={CreateAccount} props={{ redirectedFromSignUp: true }}>
          <Button
            width="226px"
            text="Create New Wallet"
            borderColor="#111"
            margin="26px 0 0 0"
            justify="center"
            boxShadow="0 4px 33px 0 rgba(30, 35, 53, 0.15)"
          />
        </StyledLink>
        <StyledLink component={ImportAccount} props={{ redirectedFromSignUp: true }}>
          <Button
            width="226px"
            text="Import Wallet"
            bgColor="#fff"
            color="#111"
            borderColor="#fff"
            margin="12px 0 0 0"
            justify="center"
            boxShadow="0 4px 50px 0 rgba(0, 0, 0, 0.1)"
          />
        </StyledLink>
        <Text>Contact Support</Text>
      </MainSection>
    </PageContainer>
  );
}

const IconSection = styled.div`
  width: 100%;
  height: 330px;
  position: relative;
`;

const IconContainer = styled.div<{ img: string }>`
  width: 279px;
  height: 279px;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center cen;
  position: absolute;
  left: -26px;
  top: -10px;
`;

const StyledLink = styled(Link)`
  width: 226px;
  text-decoration: none;
  cursor: pointer;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: auto;
`;

const Title = styled.div`
  font-size: 38.1px;
  font-weight: 500;
  letter-spacing: -1.14px;
  font-family: 'Work Sans';
  color: #18191a;
`;

const Description = styled.div`
  color: #777e90;
  font-size: 16px;
  font-weight: 400;
  font-family: Inter;
  margin-top: 6px;
`;

const Text = styled.div`
  font-family: 'IBM Plex Sans';
  margin-top: 20px;
  color: #777e90;
  font-size: 12px;
`;
