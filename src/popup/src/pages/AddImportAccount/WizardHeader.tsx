import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import { goTo } from 'react-chrome-extension-router';
import SignUp from 'pages/SignUp/SignUp';
import Wallet from 'pages/Wallet/Wallet';
import LeftArrowThinIcon from 'assets/svgComponents/LeftArrowThinIcon';
import { useEffect, useState } from 'react';

type Props = {
  title?: string;
  onClose?: () => void;
  onBack?: () => void;
  uploaded?: boolean;
  isHidden?: boolean;
};

const calcProgressBarSize = (activeStep: number, uploaded: boolean): string | undefined => {
  if (activeStep === 0 && !uploaded) return '33%';
  if (activeStep === 1 || uploaded) return '66%';
  if (activeStep === 2) return '100%';
};

export default function WizardHeader({ title, onClose, uploaded = false, isHidden = true, onBack }: Props) {
  const { activeStep, previousStep, isFirstStep } = useWizard();
  const [activeCount, setActiveCount] = useState(1);

  useEffect(()=>{
   const step = uploaded? 2: activeStep + 1
    setActiveCount(step);
  }, [uploaded, activeStep])

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

  const handleIconClick = () => {
    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <Container>
      {isHidden && <TopSection>
        <IconContainer onClick={handleIconClick}>
          {onClose ? <CloseIcon stroke="#777e90" /> : <LeftArrowThinIcon stroke="#777e90" />}
        </IconContainer>
        <Line>
          <Progress activeStep={activeStep} uploaded={uploaded} calcProgressBarSize={()=>calcProgressBarSize(activeStep, uploaded)}></Progress>
        </Line>
        <StepNumber>{activeCount}/3</StepNumber>
      </TopSection>}
      {title && (
        <BottomSection>
          <LeftIconContainer onClick={handleBack}>
            <LeftArrowThinIcon stroke="#777e90" />
          </LeftIconContainer>
          <Title>{title}</Title>
        </BottomSection>
      )}
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
  uploaded: boolean;
  calcProgressBarSize: (activeStep: number, uploaded: boolean, isConfirm: boolean) => string | undefined;
}>`
  width: ${({ activeStep, uploaded }) => calcProgressBarSize(activeStep, uploaded)};
  background-image: linear-gradient(
    to right top,
    #d7cce2,
    #ddcde1,
    #e3cee0,
    #e8cfdf,
    #edd0dd,
    #f1d1db,
    #f4d2d8,
    #f6d4d6,
    #f8d6d3,
    #f8d8d0,
    #f7dbcd,
    #f5decc
  );
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

const StepNumber = styled.div`
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  color: #353945;
`;

const Title = styled.div`
  line-height: 1.45;
  letter-spacing: 0.85px;
  text-align: center;
  color: #000;
  font-family: 'IBM Plex Sans';
  font-size: 17px;
  font-weight: 500;
  margin-right: auto;
`;
