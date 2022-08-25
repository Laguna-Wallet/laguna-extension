import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  activeStep: number;
};

const calcProgressBarSize = (activeStep: number): string | undefined => {
  if (activeStep === 0) return '33%';
  if (activeStep === 1) return '66%';
  if (activeStep === 2) return '100%';
};

export default function WizardStepHeader() {
  const history = useHistory();

  const { activeStep, previousStep, isFirstStep } = useWizard();

  const handleBack = () => {
    if (isFirstStep) {
      history.push(router.signUp);
    }
    previousStep();
  };

  return (
    <Container
    // ${activeStep === 2 && 'hidden'
    >
      <IconContainer onClick={handleBack}>
        {isFirstStep ? <CloseIcon stroke="#111" /> : <LeftArrowIcon stroke="#111" />}
      </IconContainer>
      <Line>
        <Progress activeStep={activeStep} calcProgressBarSize={calcProgressBarSize}></Progress>
      </Line>
      <div>{activeStep + 1}/3</div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
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
