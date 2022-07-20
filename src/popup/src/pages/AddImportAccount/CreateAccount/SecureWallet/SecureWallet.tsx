import { useWizard, Wizard } from 'react-use-wizard';
import { SecurityLevelEnum } from '../CreateAccount';
import ChooseSecurityLevel from './chooseSecurityLevel';
import CreatePassword from '../CreatePassword/CreatePassword';
import DecodeToViewSeed from './decodeToVeiwSeed';
import MnemonicsSeed from './mnemonicsSeed';
import { useAccount } from 'context/AccountContext';
import ConfirmSeed from './confirmSeed';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

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
  const history = useHistory();

  const { nextStep } = useWizard();
  const account = useAccount();
  const encoded = account.encryptedPassword;

  // todo refactor
  // pass onClose function instead of redirectedFromSignUp prop

  return (
    <Wizard>
      {redirectedFromDashboard && <DecodeToViewSeed />}

      <ChooseSecurityLevel
        redirectedFromSignUp={redirectedFromSignUp}
        redirectedFromDashboard={redirectedFromDashboard}
        nextStepFromParent={redirectedFromDashboard ? () => history.push(router.home) : nextStep}
        setLevel={setLevel}
      />

      {level === SecurityLevelEnum.Secured && (
        <MnemonicsSeed
          redirectedFromDashboard={redirectedFromDashboard}
          redirectedFromSignUp={redirectedFromSignUp}
        />
      )}
      {level === SecurityLevelEnum.Secured && (
        <ConfirmSeed
          redirectedFromDashboard={redirectedFromDashboard}
          redirectedFromSignUp={redirectedFromSignUp}
          nextStepFromParent={nextStep}
        />
      )}
      {!encoded && <CreatePassword redirectedFromSignUp={redirectedFromSignUp} />}

      {redirectedFromDashboard && <SetupComplete />}
    </Wizard>
  );
}
