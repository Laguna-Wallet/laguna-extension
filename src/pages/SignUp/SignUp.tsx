import Button from 'components/primitives/Button';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
import ImportWallet from 'pages/ImportWallet/ImportWallet';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';
import DonutIcon from 'assets/svgComponents/DonutIcon';
// import donut from '../../assets/imgs/donut.png';
import donut from 'assets/imgs/donut.png';
import { useEffect } from 'react';
import { testSaveToStorage } from 'utils/chrome';

export default function SignUp() {
  useEffect(() => {
    testSaveToStorage({ key: 'hello', value: '1' });
  }, []);

  return (
    <PageContainer>
      <IconSection>
        <IconContainer donut={donut}>{/* <DonutIcon /> */}</IconContainer>
      </IconSection>
      <MainSection>
        <Title>HYDROX</Title>
        <Description>Polkadot Wallet for Web 3.0</Description>
        <StyledLink component={CreateAccount}>
          <Button text="Create New Wallet" margin="40px 0 0 0" justify="center" />
        </StyledLink>
        <StyledLink component={ImportWallet}>
          <Button
            text="Import Wallet"
            bgColor="#fff"
            color="#111"
            borderColor="#111"
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
  width: 100%;
  text-decoration: none;
  cursor: pointer;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-family: 'Sequel100Wide55Wide';
`;

const Description = styled.div`
  color: #808080;
  font-size: 14px;
  font-weight: 400;
  font-family: 'SFCompactDisplayRegular';
  margin-top: 5px;
`;

const Text = styled.div`
  font-size: 12px;
  color: #808080;
  margin-top: 24px;
`;
