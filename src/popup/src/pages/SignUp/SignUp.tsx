import Button from 'components/primitives/Button';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';
import DonutIcon from 'assets/svgComponents/DonutIcon';
// import donut from '../../assets/imgs/donut.png';
import donut from 'assets/imgs/donut.png';
import ImportAccount from 'pages/AddImportForExistingUsers/ImportAccount';

export default function SignUp() {
  return (
    <PageContainer>
      <IconSection>
        <IconContainer donut={donut}>{/* <DonutIcon /> */}</IconContainer>
      </IconSection>
      <MainSection>
        <Title>Laguna</Title>
        <Description>Polkadot Wallet for Web 3.0</Description>
        <StyledLink component={CreateAccount} props={{ redirectedFromSignUp: true }}>
          <Button
            width="226px"
            text="Create New Wallet"
            borderColor="#111"
            margin="26px 0 0 0"
            justify="center"
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

const IconContainer = styled.div<{ donut: string }>`
  width: 279px;
  height: 279px;
  background-image: ${({ donut }) => `url(${donut})`};
  background-size: cover;
  position: absolute;
  left: 69px;
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
`;

const Title = styled.div`
  font-size: 38.1px;
  font-weight: 500;
  letter-spacing: -1.14px;
  font-family: 'Work Sans';
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
  margin-top: 53px;
  color: #777e90;
  font-size: 12px;
`;
