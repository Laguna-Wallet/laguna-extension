import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import { ConfirmSecuritySkip } from 'components/popups/ConfirmSecuritySkip';
import { MnemonicsDescription } from 'components/popups/MnemonicsDescription';
import Button from 'components/primitives/Button';
import { PageContainer } from 'components/ui';
import WizardHeader from 'pages/AddImportForExistingUsers/WizardHeader';
import SignUp from 'pages/SignUp/SignUp';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { SecurityOptions, SecurityOptionsEnum } from 'utils/types';
import { LevelEnum } from './SecureWallet';
import SecurityInfo from './securityInfo';
import PopupContainer from './securityInfo';

// todo onBack Prop wizard

type Props = {
  setLevel: (level: string) => void;
  nextStepFromParent: () => void;
  redirectedFromSignUp?: boolean;
};

export default function ChooseSecurityLevel({
  setLevel,
  nextStepFromParent,
  redirectedFromSignUp
}: Props) {
  const { nextStep, previousStep } = useWizard();

  const [isMnemonicDescriptionOpen, setIsMnemonicDescriptionOpen] = useState<boolean>();
  const [isConfirmSkipOpen, setConfirmSkipOpen] = useState<boolean>();

  return (
    <Container>
      <WizardHeader
        title={'SECURE YOUR WALLET'}
        onClose={() => {
          if (redirectedFromSignUp) {
            goTo(SignUp);
          } else {
            goTo(Wallet);
          }
        }}
        onBack={() => {
          if (redirectedFromSignUp) {
            goTo(SignUp);
          } else {
            previousStep();
          }
        }}
      />

      {isMnemonicDescriptionOpen && (
        <MnemonicsDescription onClose={() => setIsMnemonicDescriptionOpen(false)} />
      )}
      {isConfirmSkipOpen && (
        <ConfirmSecuritySkip
          setLevel={setLevel}
          nextStepFromParent={nextStepFromParent}
          nextStep={nextStep}
        />
      )}

      <IconContainer>
        <Icon></Icon>
      </IconContainer>
      <TextContainer>
        To secure your wallet you&apos;ll be given a 12 word{' '}
        <span onClick={() => setIsMnemonicDescriptionOpen(true)}>Mnemonic seed phrase.</span> Store
        this in a safe place. It&apos;s the only way to recover your wallet if you get locked out or
        get a new device.
      </TextContainer>
      <Buttons>
        <Button
          type="button"
          onClick={() => setConfirmSkipOpen(true)}
          Icon={<RightArrow width={23} />}
          text={'Remind me Later'}
          borderColor="#ececec"
          bgColor="#ececec"
          color={'#111'}
        />
        <Button
          type="button"
          onClick={() => {
            setLevel(LevelEnum.Secured);
            nextStep();
          }}
          Icon={<RightArrow width={23} fill="#fff" />}
          text={'Start'}
          margin="14px 0px 0px 0px"
        />
      </Buttons>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const Title = styled.span`
  font-family: 'Sequel100Wide55Wide';
  font-size: 17px;
  letter-spacing: 0.85px;
  margin-top: 30px;
`;

const IconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const Icon = styled.div`
  width: 153px;
  height: 153px;
  border-radius: 100%;
  background-color: #efefef;
`;

const TextContainer = styled.div`
  font-size: 16px;
  margin-top: auto;
  font-family: 'SFCompactDisplayRegular';
  color: #767e93;
  line-height: 1.45;

  span {
    cursor: pointer;
    color: #111;
  }
`;

const Buttons = styled.div`
  margin-top: auto;
`;
