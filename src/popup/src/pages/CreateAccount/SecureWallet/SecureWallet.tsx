import { PageContainer } from 'components/ui';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import { useState } from 'react';
import { useWizard, Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from '../Congrats/CongratsSecuringWallet';
import { SecurityLevelEnum } from '../CreateAccount';
import ChooseSecurityLevel from './chooseSecurityLevel';
import ConfirmSeed from './confirmSeed';
import MnemonicsSeed from './mnemonicsSeed';

type Props = {
  redirectedFromSignUp?: boolean;
  setLevel: (level: SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped) => void;
  level: SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped;
};

export default function SecureWallet({ level, setLevel, redirectedFromSignUp }: Props) {
  const { nextStep } = useWizard();

  // todo refactor
  // pass onClose function instead of redirectedFromSignUp prop
  // const onClose = () => redirectedFromSignUp ? goTo(Signup) : goTo(Wallet)

  return (
    <Wizard>
      <ChooseSecurityLevel
        redirectedFromSignUp={redirectedFromSignUp}
        nextStepFromParent={nextStep}
        setLevel={setLevel}
      />

      {level === SecurityLevelEnum.Secured && (
        <MnemonicsSeed redirectedFromSignUp={redirectedFromSignUp} />
      )}

      {level === SecurityLevelEnum.Secured && (
        <ConfirmSeed redirectedFromSignUp={redirectedFromSignUp} handleNextSection={nextStep} />
      )}
    </Wizard>
  );
}
