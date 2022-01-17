import { PageContainer } from 'components/ui';
import { useAccount } from 'context/AccountContext';
import { useWizard, Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from '../Congrats/CongratsSecuringWallet';
import ChooseSecurityLevel from './chooseSecurityLevel';
import ConfirmSeed from './confirmSeed';
import MnemonicsSeed from './mnemonicsSeed';

export default function SecureWallet() {
  const { nextStep } = useWizard();
  const account = useAccount();

  return (
    <Wizard>
      <ChooseSecurityLevel />
      <MnemonicsSeed />
      <ConfirmSeed handleNextSection={nextStep} />
      <CongratsSecuringWallet />
    </Wizard>
  );
}
