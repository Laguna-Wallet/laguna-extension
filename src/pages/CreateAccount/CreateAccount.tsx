import { PageContainer } from 'components/ui';
import WizardStepHeader from 'components/WizardStepHeader/WizardStepHeader';
import { useAccount } from 'context/AccountContext';
import { Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from './Congrats/CongratsSecuringWallet';
import CreatePassword from './CreatePassword/createPassword';
import SecureWallet from './SecureWallet/SecureWallet';

export default function CreateAccount() {
  const account = useAccount();

  const encoded = account.getEncryptedPassword();

  return (
    <PageContainer>
      <Wizard header={<WizardStepHeader />}>
        {!encoded && <CreatePassword />}
        <SecureWallet />
        <CongratsSecuringWallet />
      </Wizard>
    </PageContainer>
  );
}
