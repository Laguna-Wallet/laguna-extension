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
import AddBigIcon from 'assets/svgComponents/AddBigIcon';

export default function AddImportForBoardedUser() {
  return (
    <Wizard>
      <Container>
        <WizardHeader
          title={'ADD / IMPORT ACCOUNT'}
          onBack={() => goTo(Wallet)}
          onClose={() => goTo(SignUp)}
          isHidden={false}
        />
        <PlusIconContainer>
          <AddBigIcon width={118} height={118} fill="#000" />
        </PlusIconContainer>
        <ButtonContainer>
          <Button
            type="button"
            Icon={<RightArrow width={23} />}
            text={'Create New Account'}
            justify="center"
            marginText="0 6px"
            onClick={() => goTo(CreateAccount)}
          />
          <Button
            type="button"
            Icon={<RightArrow width={23} />}
            text={'Import Account'}
            margin="10px 0 0 0"
            justify="center"
            marginText="0 6px"
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
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin-top: 110px;
  filter: drop-shadow(5px 5px 50px rgba(0, 0, 0, 0.05));
  width: 167.3px;
  height: 167.3px;
  background-color: #fff;
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
