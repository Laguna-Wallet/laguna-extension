import RightArrow from 'assets/svgComponents/RightArrow';
import SecureWalletLogo from 'assets/svgComponents/SecureWalletLogo';
import { ConfirmSecuritySkip } from 'components/popups/ConfirmSecuritySkip';
import { MnemonicsDescription } from 'components/popups/MnemonicsDescription';
import Button from 'components/primitives/Button';
import { useEnterClickListener } from 'hooks/useEnterClickListener';
import WizardHeader from 'pages/AddImportAccount/WizardHeader';
import { useState } from 'react';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { SecurityLevelEnum } from '../CreateAccount';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

// todo onBack Prop wizard

type Props = {
  setLevel: (level: SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped) => void;
  nextStepFromParent: () => void;
  redirectedFromSignUp?: boolean;
  redirectedFromDashboard?: boolean;
};

export default function ChooseSecurityLevel({
  setLevel,
  nextStepFromParent,
  redirectedFromSignUp,
  redirectedFromDashboard
}: Props) {
  const history = useHistory();

  const { nextStep, previousStep } = useWizard();

  const [isMnemonicDescriptionOpen, setIsMnemonicDescriptionOpen] = useState<boolean>();
  const [isConfirmSkipOpen, setConfirmSkipOpen] = useState<boolean>();

  useEnterClickListener(() => nextStep(), []);

  return (
    <Container redirectedFromDashboard={redirectedFromDashboard}>
      <WizardHeader
        // title={'SECURE YOUR WALLET'}
        onClose={() => {
          if (redirectedFromSignUp) {
            history.push(router.signUp);
          } else {
            history.push(router.home);
          }
        }}
        onBack={() => {
          if (redirectedFromSignUp) {
            history.push(router.signUp);
          } else {
            previousStep();
          }
        }}
        isMnemonics
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

      <Title>Secure Your Account</Title>

      <IconContainer>
        <Icon>
          <SecureWalletLogo />
        </Icon>
      </IconContainer>
      <TextContainer>
        To secure your wallet you&apos;ll be given a{' '}
        <span onClick={() => setIsMnemonicDescriptionOpen(true)}>seed phrase.</span> Store this in a
        safe place. It&apos;s the only way to recover your account if you get locked out of the app
        or get a new device.
      </TextContainer>
      <Buttons>
        <Button
          type="button"
          onClick={() => {
            setLevel(SecurityLevelEnum.Secured);
            nextStep();
          }}
          Icon={<RightArrow width={23} fill="#fff" />}
          text={'Start'}
          margin="14px 0px 0px 0px"
          justify="center"
        />

        {!redirectedFromDashboard && (
          <SkipButton onClick={() => setConfirmSkipOpen(true)}>Skip Security</SkipButton>
        )}

        {/* <Button
          type="button"
          onClick={() => setConfirmSkipOpen(true)}
          Icon={<RightArrow width={23} />}
          text={'Remind me Later'}
          borderColor="#ececec"
          bgColor="#ececec"
          color={'#111'}
        /> */}
      </Buttons>
    </Container>
  );
}

const Container = styled.div<{ redirectedFromDashboard?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  padding: ${({ redirectedFromDashboard }) =>
    redirectedFromDashboard ? '22px 16px 38px; ' : '22px 16px 11px'};
  box-sizing: border-box;
`;

const Title = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
  margin-top: 30px;
  padding: 0 10px;
  color: #18191a;
`;

const IconContainer = styled.div`
  width: 153px;
  height: 153px;
  border-radius: 100%;
  background-color: #f9fafb;
  display: flex;
  margin: 24px auto 0;
  position: relative;
`;

const Icon = styled.div`
  position: absolute;
  top: 70px;
  left: -20px;
`;

const TextContainer = styled.div`
  font-family: Inter;
  font-size: 16px;
  margin-top: auto;
  text-align: left;
  color: #353945;
  line-height: 1.5;
  padding: 0 10px;

  span {
    cursor: pointer;
    color: #111;
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
`;

const SkipButton = styled.div`
  width: 89px;
  height: 16px;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  color: #18191a;
  border-bottom: 1px solid #18191a;
  margin-top: 8px;
  cursor: pointer;
`;
