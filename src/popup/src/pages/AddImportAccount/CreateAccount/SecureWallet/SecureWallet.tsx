import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { useWizard, Wizard } from 'react-use-wizard';
import { SecurityLevelEnum } from '../CreateAccount';
import ChooseSecurityLevel from './chooseSecurityLevel';
import CreatePassword from '../CreatePassword/CreatePassword';
import DecodeToViewSeed from './decodeToVeiwSeed';
import MnemonicsSeed from './mnemonicsSeed';
import SetupComplete from '../../SetupComplete';
import { useAccount } from 'context/AccountContext';

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
  const account = useAccount();
  const encoded = account.encryptedPassword;

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
          nextStepFromParent={nextStep}
        />
      )}

      {!encoded && <CreatePassword redirectedFromSignUp={redirectedFromSignUp} />}
      {/* <SetupComplete /> */}
    </Wizard>
  );
}
