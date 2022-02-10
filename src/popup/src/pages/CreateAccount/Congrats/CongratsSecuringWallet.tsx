import { ArrowSmRightIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import LockIcon from 'assets/svgComponents/LockIcon';
import Button from 'components/primitives/Button';
import { useAccount } from 'context/AccountContext';
import Wallet from 'pages/Wallet/Wallet';
import { memo, useEffect } from 'react';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { saveToStorage } from 'utils/chrome';
import { generateKeyPair } from 'utils/polkadot';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import RightArrow from 'assets/svgComponents/RightArrow';
import { encryptPassword } from 'utils';
import { StorageKeys } from 'utils/types';

export default memo(function CongratsSecuringWallet() {
  const account = useAccount();

  return (
    <Container>
      <MainContent>
        <IconContainer>
          <CheckMarkContainer>
            <CheckMarkIcon />
          </CheckMarkContainer>
          <Circle />
          <LockContainer>
            <LockIcon />
          </LockContainer>
        </IconContainer>
        <Title>CONGRATULATIONS YOUR WALLET IS SECURED</Title>
        <Description>
          Remember to keep your seed phrase safe. HydroX cannot recover your wallet should you lose
          it. You can view your seed phrase under
        </Description>
        <HelperText>settings {'>'} security & privacy</HelperText>
      </MainContent>
      <StyledLink component={Wallet}>
        <Button text={'Continue'} Icon={<RightArrow width={23} />}></Button>
      </StyledLink>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MainContent = styled.div``;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: 50px;
`;

const Circle = styled.div`
  width: 180px;
  height: 180px;
  background: linear-gradient(265.71deg, #1cc3ce -32.28%, #b9e260 104.04%);
  border-radius: 100%;
`;

const CheckMarkContainer = styled.div`
  position: absolute;
  top: -30px;
  right: 60px;
`;

const LockContainer = styled.div`
  position: absolute;
  top: 70px;
`;

const Title = styled.div`
  line-height: 1.45;
  letter-spacing: 0.85px;
  text-align: center;
  color: #000;
  font-size: 17px;
  margin-top: 11px;
  margin-top: 50px;
  font-family: 'Sequel100Wide55Wide';
`;

const Description = styled.div`
  text-align: center;
  color: #767e93;
  margin-top: 25px;
  font-size: 16px;
  font-family: 'SFCompactDisplayRegular';
`;

const HelperText = styled.div`
  text-align: center;
  color: #767e93;
  font-weight: 600;
  line-height: 23.2px;
  font-size: 16px;
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none;
`;
