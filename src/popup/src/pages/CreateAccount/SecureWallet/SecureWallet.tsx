import { PageContainer } from 'components/ui';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useWizard, Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from '../Congrats/CongratsSecuringWallet';
import { SecurityLevelEnum } from '../CreateAccount';
import ChooseSecurityLevel from './chooseSecurityLevel';
import ConfirmSeed from './confirmSeed';
import DecodeToViewSeed from './decodeToVeiwSeed';
import MnemonicsSeed from './mnemonicsSeed';

type Props = {
  redirectedFromSignUp?: boolean;
  redirectedFromDashboard?: boolean;
  setLevel: (level: SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped) => void;
  level: SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped;
};

export default function SecureWallet({
  level,
  setLevel,
  redirectedFromSignUp,
  redirectedFromDashboard
}: Props) {
  const { nextStep } = useWizard();

  // todo refactor
  // pass onClose function instead of redirectedFromSignUp prop
  // const onClose = () => redirectedFromSignUp ? goTo(Signup) : goTo(Wallet)

  return (
    <Wizard>
      {redirectedFromDashboard && <DecodeToViewSeed />}

      <ChooseSecurityLevel
        redirectedFromSignUp={redirectedFromSignUp}
        nextStepFromParent={redirectedFromDashboard ? () => goTo(Wallet) : nextStep}
        setLevel={setLevel}
      />

      {level === SecurityLevelEnum.Secured && (
        <MnemonicsSeed
          redirectedFromDashboard={redirectedFromDashboard}
          redirectedFromSignUp={redirectedFromSignUp}
        />
      )}

      {level === SecurityLevelEnum.Secured && (
        <ConfirmSeed redirectedFromSignUp={redirectedFromSignUp} handleNextSection={nextStep} />
      )}
    </Wizard>
  );
}
