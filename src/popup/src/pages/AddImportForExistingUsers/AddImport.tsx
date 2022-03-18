import PlusIcon from '@heroicons/react/outline/PlusIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { PhaseEnum } from './AddImportForExistingUsers';
import WizardHeader from './WizardHeader';

type Props = {
  setPhase: (phase: string) => void;
};

export default function AddImport({ setPhase }: Props) {
  const { nextStep } = useWizard();

  const handleClick = (phase: string) => {
    setPhase(phase);
    nextStep();
  };

  return (
    <Container>
      <WizardHeader title={'ADD / IMPORT WALLET'} onClose={() => goTo(Wallet)} />
      <PlusIconContainer>
        <PlusIcon width={66} stroke="#111" />
      </PlusIconContainer>
      <ButtonContainer>
        <Button
          type="button"
          Icon={<RightArrow width={23} />}
          text={'Create a New Wallet'}
          onClick={() => handleClick(PhaseEnum.Create)}
          justify="center"
        />
        <Button
          type="button"
          Icon={<RightArrow width={23} />}
          text={'Import a Wallet'}
          margin="10px 0 0 0"
          onClick={() => handleClick(PhaseEnum.Import)}
          justify="center"
        />
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background-color: #fff;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const PlusIconContainer = styled.div`
  width: 167.3px;
  height: 167.3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin-top: 110px;
  background-color: #fff;
  box-shadow: 5px 5px 50px 0 rgba(0, 0, 0, 0.05);
`;

const StepHeading = styled.div`
  width: 100%;
  height: 40px;
`;

const Title = styled.span`
  font-size: 17px;
  font-family: 'Sequel100Wide55Wide';
  letter-spacing: 0.85px;
  color: #000000;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
