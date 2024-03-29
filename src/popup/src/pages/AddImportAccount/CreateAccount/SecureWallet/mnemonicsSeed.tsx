import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { copyToClipboard } from 'utils';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import Button from 'components/primitives/Button';
import { useWizard } from 'react-use-wizard';
import { useAccount } from 'context/AccountContext';
import WizardHeader from 'pages/AddImportAccount/WizardHeader';
import Snackbar from 'components/Snackbar/Snackbar';
import { MnemonicsDescription } from 'components/popups/MnemonicsDescription';
import { useEnterClickListener } from 'hooks/useEnterClickListener';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  redirectedFromSignUp?: boolean;
  redirectedFromDashboard?: boolean;
};

export default function MnemonicsSeed({ redirectedFromSignUp, redirectedFromDashboard }: Props) {
  const history = useHistory();

  const { nextStep, previousStep, handleStep } = useWizard();
  const [mnemonics, setMnemonics] = useState<string[]>([]);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isMnemonicDescriptionOpen, setIsMnemonicDescriptionOpen] = useState<boolean>();

  handleStep(() => {
    return;
  });

  const account = useAccount();
  useEffect(() => {
    if (redirectedFromDashboard) {
      // set from decodeToViewSeed page
      setMnemonics(account.mnemonics);
    } else {
      const mnemonics = account.generateMnemonics();
      setMnemonics(mnemonics);
    }
  }, []);

  const handleCopy = () => {
    copyToClipboard(mnemonics?.join(' '));
    setIsSnackbarOpen(true);
    setSnackbarMessage('Mnemonics Copied');
  };

  useEnterClickListener(
    () => !isMnemonicDescriptionOpen && nextStep(),
    [isMnemonicDescriptionOpen]
  );

  return (
    <Container>
      <WizardHeader
        onClose={() => {
          if (redirectedFromSignUp) {
            history.push(router.signUp);
          } else {
            history.push(router.home);
          }
        }}
        onBack={() => {
          previousStep();
        }}
      />
      <MainContent>
        <Title>Backup Seed Phrase</Title>
        <Description>
          To secure your accounts please write down this 12 word{' '}
          <span onClick={() => setIsMnemonicDescriptionOpen(true)}> mnemonic seed phrase.</span>{' '}
          Store this in a safe place. It&apos;s the only way to recover your account if you get
          locked out or get a new device.
        </Description>
        <MnemonicsContainer>
          {mnemonics?.map((name, index) => (
            <Mnemonic key={`seed-mnemonic-${index}`}>
              <MnemonicIndex> {index + 1}</MnemonicIndex>
              <MnemonicName>{name}</MnemonicName>
            </Mnemonic>
          ))}
        </MnemonicsContainer>

        {mnemonics && (
          <CopyBtn onClick={handleCopy}>
            <ButtonsIcon fill="#18191a" />
            <span>Copy</span>
          </CopyBtn>
        )}

        {isMnemonicDescriptionOpen && (
          <MnemonicsDescription onClose={() => setIsMnemonicDescriptionOpen(false)} />
        )}

        <Snackbar
          width="194.9px"
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={snackbarMessage}
          type="success"
          // left="110px"
          bottom="30px"
        />
      </MainContent>
      <ButtonContainer>
        <Button
          onClick={nextStep}
          text={'Continue'}
          justify="center"
          // Icon={<RightArrow width={23} />}
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
  background-color: #f9fafb;
  padding: 22px 16px 38px;
  box-sizing: border-box;
`;

const MainContent = styled.div`
  margin-top: 30px;
  padding: 0 10px;
`;

const Title = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
  color: #18191a;
  margin-top: 30px;
`;

const Description = styled.div`
  margin-top: 16px;
  font-family: Inter;
  font-size: 16px;
  line-height: 1.45;
  color: #353945;
  text-align: left;
  max-width: 314px;
  width: 100%;
  span {
    font-weight: 600;
    cursor: pointer;
  }
`;

const MnemonicsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const Mnemonic = styled.div`
  width: 97px;
  height: 34px;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  margin-right: 14px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
`;

const MnemonicName = styled.span`
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
`;

const MnemonicIndex = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9f9f9f;
  margin-right: 5px;
`;

const CopyBtn = styled.div`
  width: 70px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #e6e8ec;
  color: #18191a;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'IBM Plex Sans';

  span {
    margin-left: 5px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  margin-top: auto;
`;
