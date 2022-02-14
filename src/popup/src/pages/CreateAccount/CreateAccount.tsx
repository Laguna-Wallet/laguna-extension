import keyring from '@polkadot/ui-keyring';
import { PageContainer } from 'components/ui';
import WizardStepHeader from 'components/WizardStepHeader/WizardStepHeader';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportForExistingUsers/EncodeAccount';
import SetupComplete from 'pages/AddImportForExistingUsers/SetupComplete';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from './Congrats/CongratsSecuringWallet';
import CreatePassword from './CreatePassword/CreatePassword';
import SecureWallet from './SecureWallet/SecureWallet';
import { randomAsHex } from '@polkadot/util-crypto';
import SignUp from 'pages/SignUp/SignUp';

type Props = {
  existingAccount?: boolean;
  encodePhase?: boolean;
  redirectedFromSignUp?: boolean;
};

export default function CreateAccount({ redirectedFromSignUp, encodePhase }: Props) {
  const account = useAccount();
  const encoded = account.encryptedPassword;

  const handleEncode = (password: string) => {
    // note for now seed creation flow saves mnemonic in Account Context
    // would be better to refactor and save data in redux, (just for flow)
    if (account.mnemonics) {
      const mnemonicsStr = account?.mnemonics.join(' ');
      const { pair } = keyring.addUri(mnemonicsStr, password);
      keyring.saveAccountMeta(pair, { name: pair.address });
    } else {
      const hex = randomAsHex(32);
      const { pair } = keyring.addUri(hex, password);
      keyring.saveAccountMeta(pair, { name: pair.address });
    }
  };

  const onBack = (backAction: () => void) => {
    backAction();
  };

  const onClose = () => {
    if (redirectedFromSignUp) {
      goTo(SignUp);
    } else {
      goTo(Wallet);
    }
  };

  return (
    <Wizard>
      {/* type in account password */}
      {!encoded && <CreatePassword />}
      <SecureWallet redirectedFromSignUp={redirectedFromSignUp} />
      <EncodeAccount handleEncode={handleEncode} onClose={onClose} onBack={onBack} />
      <SetupComplete />
    </Wizard>
  );
}
