import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import Button from 'components/primitives/Button';
import Checkbox from 'components/primitives/Checkbox';
import { PageContainer } from 'components/ui';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components/macro';

type Props = {
  onClose: () => void;
};

export function MnemonicsDescription({ onClose }: Props) {
  return (
    <Container>
      <MainContent>
        <TopContent>
          <Line />
          <Title>What is a &apos;Mnemonic Seed phrase&apos;</Title>
          <Description>
            <p>
              A seed phrase is a set of twelve words that contains all the information about your
              wallet, including your funds. It&apos;s like a secret code used to access your entire
              wallet.
            </p>
            <p>
              You must keep your seed phrase secret and safe. If someone gets your seed phrase,
              they&apos;ll gain control over your accounts.
            </p>
          </Description>
        </TopContent>
        <ButtonContainer>
          <Button onClick={onClose} text={'I Understand'} justify="center" />
        </ButtonContainer>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
`;

const MainContent = styled.div`
  width: 100%;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 38px 16px;
  box-sizing: border-box;
  background-color: #f8f8f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Line = styled.div`
  width: 48px;
  height: 6px;
  background-color: #d1d4db;
  margin-top: 8px;
  border-radius: 100px;
`;

const Title = styled.span`
  width: 100%;
  margin-top: 24px;
  font-size: 18px;
  font-family: 'SFCompactDisplayRegular';
  font-weight: 600;
  line-height: 1.35;
  text-align: left;
  color: #090a0b;
`;

const Description = styled.div`
  margin-top: 22px;
  color: #767e93;
  line-height: 1.45;
  font-size: 16px;
  p:nth-child(2) {
    margin-top: 20px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;
