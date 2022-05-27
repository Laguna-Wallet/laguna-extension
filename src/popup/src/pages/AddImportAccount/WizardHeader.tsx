import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import LeftArrowThinIcon from 'assets/svgComponents/LeftArrowThinIcon';
import ProgressBarCloseIcon from 'assets/svgComponents/ProgressBarCloseIcon';

type Props = {
  title?: string;
  onClose?: () => void;
  onBack?: () => void;
  isHidden?: boolean;
  isFinishSlider?: boolean;
  isMnemonics?: boolean;
};

const calcProgressBarSize = (
  activeStep: number,
  isFinishSlider: boolean,
  isMnemonics: boolean
): string | undefined => {
  if ((activeStep === 0 || isFinishSlider) && !isMnemonics) return isFinishSlider ? '100%' : '50%';
  if (activeStep === 0 && isMnemonics) return '33%';
  if (activeStep === 1) return '66%';
  if (activeStep === 2) return '100%';
};

export default function WizardHeader({
  title,
  onClose,
  isHidden = true,
  onBack,
  isFinishSlider = false,
  isMnemonics = false
}: Props) {
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

  const handleIconClick = () => {
    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <Container>
      {isHidden && (
        <TopSection>
          <IconContainer onClose={!!onClose} onClick={handleIconClick}>
            {onClose ? <ProgressBarCloseIcon /> : <LeftArrowThinIcon stroke="#777e90" />}
          </IconContainer>
          <Line>
            <Progress
              activeStep={activeStep}
              isMnemonics={isMnemonics}
              isFinishSlider={isFinishSlider}
              calcProgressBarSize={() =>
                calcProgressBarSize(activeStep, isFinishSlider, isMnemonics)
              }></Progress>
          </Line>
        </TopSection>
      )}
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

const IconContainer = styled.div<{ onClose?: boolean }>`
  cursor: pointer;
  width: ${({ onClose }) => (onClose ? '24px' : '16px')};
  height: ${({ onClose }) => (onClose ? '24px' : '16px')};
`;

const Line = styled.div`
  width: 100%;
  background-color: #f4f4f6;
  border-radius: 120px;
  margin: 8px 0 8px 12px;
`;

const Progress = styled.div<{
  activeStep: number;
  isFinishSlider: boolean;
  isMnemonics: boolean;
  calcProgressBarSize: (
    activeStep: number,
    isConfirm: boolean,
    isFinishSlider: boolean,
    isMnemonics: boolean
  ) => string | undefined;
}>`
  width: ${({ activeStep, isFinishSlider, isMnemonics }) =>
    calcProgressBarSize(activeStep, isFinishSlider, isMnemonics)};
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
  margin-top: 15px;
`;

const LeftIconContainer = styled.div`
  margin-right: auto;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  aline-item: center;
  justify-content: center;
`;

const StepNumber = styled.div`
  font-family: Inter;
  font-size: 12px;
  font-weight: 600;
  color: #353945;
`;

const Title = styled.div`
  text-align: center;
  color: #18191a;
  font-family: 'IBM Plex Sans';
  font-size: 17px;
  font-weight: 500;
  margin-right: auto;
  line-height: 2.35;
  letter-spacing: 1.7px;
`;
