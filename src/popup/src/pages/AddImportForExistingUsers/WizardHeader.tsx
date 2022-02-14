import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import { goTo } from 'react-chrome-extension-router';
import SignUp from 'pages/SignUp/SignUp';
import Wallet from 'pages/Wallet/Wallet';

type Props = {
  title: string;
  onClose: () => void;
  onBack?: () => void;
};

const calcProgressBarSize = (activeStep: number): string | undefined => {
  if (activeStep === 0) return '33%';
  if (activeStep === 1) return '66%';
  if (activeStep === 2) return '100%';
};

export default function WizardHeader({ title, onClose, onBack }: Props) {
  const { activeStep, previousStep, isFirstStep } = useWizard();

  const handleBack = () => {
    if (isFirstStep) {
      goTo(Wallet);
    }
    if (onBack) {
      onBack();
    } else {
      previousStep();
    }
  };

  return (
    <Container>
      <TopSection>
        <IconContainer onClick={onClose}>
          <CloseIcon stroke="#111" />
        </IconContainer>
        <Line>
          <Progress activeStep={activeStep} calcProgressBarSize={calcProgressBarSize}></Progress>
        </Line>
        <div>{activeStep + 1}/3</div>
      </TopSection>
      <BottomSection>
        <LeftIconContainer onClick={handleBack}>
          <LeftArrowIcon stroke="#111" />
        </LeftIconContainer>
        <Title>{title}</Title>
      </BottomSection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
`;

const IconContainer = styled.div`
  cursor: pointer;
  margin-bottom: 2px;
`;

const Line = styled.div`
  width: 100%;
  background-color: #f4f4f6;
  border-radius: 120px;
  margin: 8px;
`;

const Progress = styled.div<{
  activeStep: number;
  calcProgressBarSize: (activeStep: number) => string | undefined;
}>`
  width: ${({ activeStep }) => calcProgressBarSize(activeStep)};
  background-color: #111;
  border-radius: 120px;
  height: 8px;
`;

const TopSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const LeftIconContainer = styled.div`
  margin-right: auto;
  cursor: pointer;
`;

const Title = styled.div`
  line-height: 1.45;
  letter-spacing: 0.85px;
  text-align: center;
  color: #000;
  font-size: 17px;
  font-family: 'Sequel100Wide55Wide';
  margin-right: auto;
`;