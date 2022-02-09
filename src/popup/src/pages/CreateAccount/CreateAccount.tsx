import { PageContainer } from 'components/ui';
import WizardStepHeader from 'components/WizardStepHeader/WizardStepHeader';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import { Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from './Congrats/CongratsSecuringWallet';
import CreatePassword from './CreatePassword/createPassword';
import SecureWallet from './SecureWallet/SecureWallet';

type Props = {
  existingAccount: boolean;
  encodePhase?: boolean;
};

export default function CreateAccount({ existingAccount, encodePhase }: Props) {
  const account = useAccount();
  const encoded = account.getEncryptedPassword();

  return (
    <Wizard>
      {/* type in account password */}
      {!encoded && <CreatePassword />}
      <SecureWallet />
      <EncodeAccount />
      {/* <CongratsSecuringWallet /> */}
    </Wizard>
  );
}
