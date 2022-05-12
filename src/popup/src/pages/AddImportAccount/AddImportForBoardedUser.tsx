import { Wizard } from 'react-use-wizard';
import ImportAccount from './ImportAccount/ImportAccount';
import CreateAccount from './CreateAccount/CreateAccount';

import PlusIcon from '@heroicons/react/outline/PlusIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import styled from 'styled-components';
import SignUp from 'pages/SignUp/SignUp';

import WizardHeader from 'pages/AddImportAccount/WizardHeader';

export default function AddImportForBoardedUser() {
  return (
    <Wizard>
    <Container>
       <WizardHeader
        title={'ADD / IMPORT WALLET'}
        onBack={() => goTo(Wallet)}
        onClose={() => goTo(SignUp)}
        isHidden={false}
          />
      <PlusIconContainer>
        <PlusIcon width={46} stroke="#999999" />
      </PlusIconContainer>
      <ButtonContainer>
        <Button
          type="button"
          Icon={<RightArrow width={23} />}
          text={'Create a New Wallet'}
          onClick={() => goTo(CreateAccount)}
        />
        <Button
          type="button"
          Icon={<RightArrow width={23} />}
          text={'Import a Wallet'}
          margin="10px 0 0 0"
          onClick={() => goTo(ImportAccount)}
        />
      </ButtonContainer>
    </Container>
    </Wizard>
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
  width: 149px;
  height: 149px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin-top: 110px;
  background-color: #f4f4f6;
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
