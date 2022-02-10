import { PageContainer } from 'components/ui';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import { useState } from 'react';
import { useWizard, Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from '../Congrats/CongratsSecuringWallet';
import ChooseSecurityLevel from './chooseSecurityLevel';
import ConfirmSeed from './confirmSeed';
import MnemonicsSeed from './mnemonicsSeed';

export enum LevelEnum {
  Secured = 'Secured',
  Skipped = 'Skipped'
}

type Props = {
  redirectedFromSignUp?: boolean;
};

export default function SecureWallet({ redirectedFromSignUp }: Props) {
  const { nextStep } = useWizard();
  const [level, setLevel] = useState('');

  return (
    <Wizard>
      <ChooseSecurityLevel
        redirectedFromSignUp={redirectedFromSignUp}
        nextStepFromParent={nextStep}
        setLevel={setLevel}
      />
      {level === LevelEnum.Secured && <MnemonicsSeed />}
      {level === LevelEnum.Secured && <ConfirmSeed handleNextSection={nextStep} />}
    </Wizard>
  );
}
