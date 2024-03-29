import styled from "styled-components";
import CloseIcon from "assets/svgComponents/CloseIcon";
import LeftArrowThinIcon from "assets/svgComponents/LeftArrowThinIcon";

type Props = {
  title?: string;
  onClose?: () => void;
  onBack?: () => void;
};

const calcProgressBarSize = (activeStep: number): string | undefined => {
  if (activeStep === 0) return "33%";
  if (activeStep === 1) return "66%";
  if (activeStep === 2) return "100%";
};

export default function WizardHeader({ title, onClose, onBack }: Props) {
  const handleBack = () => {
    onBack && onBack();
  };

  const handleIconClick = () => {
    onClose && onClose();
  };

  return (
    <Container>
      <TopSection>
        <IconContainer onClick={handleIconClick}>
          {onClose ? <CloseIcon stroke="#777e90" /> : <LeftArrowThinIcon stroke="#777e90" />}
        </IconContainer>
        <Line>
          <Progress activeStep={0} calcProgressBarSize={calcProgressBarSize}></Progress>
        </Line>
        {/* <StepNumber>{activeStep + 1}/3</StepNumber> */}
      </TopSection>
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
  calcProgressBarSize: (activeStep: number) => string | undefined;
}>`
  width: ${({ activeStep }) => calcProgressBarSize(activeStep)};
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
  font-family: "IBM Plex Sans";
  font-size: 17px;
  font-weight: 500;
  margin-right: auto;
`;
