import { PageContainer } from 'components/ui';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import { useWizard, Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from '../Congrats/CongratsSecuringWallet';
import ChooseSecurityLevel from './chooseSecurityLevel';
import ConfirmSeed from './confirmSeed';
import MnemonicsSeed from './mnemonicsSeed';

export default function SecureWallet() {
  const { nextStep } = useWizard();

  return (
    <Wizard>
      <ChooseSecurityLevel />
      <MnemonicsSeed />
      <ConfirmSeed handleNextSection={nextStep} />
    </Wizard>
  );
}
