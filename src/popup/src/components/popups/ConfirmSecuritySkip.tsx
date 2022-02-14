import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import Button from 'components/primitives/Button';
import Checkbox from 'components/primitives/Checkbox';
import { LevelEnum } from 'pages/CreateAccount/SecureWallet/SecureWallet';
import { useState } from 'react';
import styled from 'styled-components';

type Props = {
  nextStep: () => void;
  nextStepFromParent: () => void;
  setLevel: (level: string) => void;
};

export function ConfirmSecuritySkip({ nextStep, nextStepFromParent, setLevel }: Props) {
  const [checked, setChecked] = useState(false);

  const handleSkip = () => {
    if (checked) {
      setLevel(LevelEnum.Skipped);
      nextStepFromParent();
    }
  };

  const handleSecure = () => {
    setLevel(LevelEnum.Secured);
    nextStep();
  };

  return (
    <Container>
      <MainContent>
        <Title>Skip Account Security?</Title>

        <Description>
          <Checkbox value={checked} onChange={setChecked} />
          <span> I understand that without a seed phrase I cannot restore my wallet</span>
        </Description>

        <ButtonContainer>
          <Button
            onClick={handleSecure}
            Icon={<ArrowSmRightIcon width={23} />}
            text={'Secure Now'}
          />
          <Gap />
          <Button
            onClick={handleSkip}
            bgColor="transparent"
            color="#111"
            Icon={<ArrowSmRightIcon width={23} />}
            text={'Skip'}
          />
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
  height: 242px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
  background-color: #f8f8f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled.h3`
  width: 100%;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  text-align: left;
  color: #090a0b;
  margin: 0;
`;

const Description = styled.div`
  display: flex;
  color: #767e93;
  line-height: 1.45;
  font-size: 16px;
  margin-top: 20px;
  span {
    margin-left: 11px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;

const Gap = styled.div`
  width: 20px;
`;
