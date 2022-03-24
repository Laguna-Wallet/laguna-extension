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
import { useState } from 'react';
import { Messages } from 'utils/types';
import { generateRandomBase64Avatar } from 'utils';

type Props = {
  existingAccount?: boolean;
  encodePhase?: boolean;
  redirectedFromSignUp?: boolean;
};

export enum SecurityLevelEnum {
  Secured = 'Secured',
  Skipped = 'Skipped'
}

export default function CreateAccount({ redirectedFromSignUp, encodePhase }: Props) {
  const account = useAccount();
  const encoded = account.encryptedPassword;

  const [securityLevel, setSecurityLevel] = useState<
    SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped
  >(SecurityLevelEnum.Secured);

  const handleEncode = async (password: string) => {
    // note for now seed creation flow saves mnemonic in Account Context
    // would be better to refactor and save data in redux, (just for flow)
    if (securityLevel === SecurityLevelEnum.Secured && account?.mnemonics) {
      const mnemonicsStr = account?.mnemonics.join(' ');
      const { pair } = keyring.addUri(mnemonicsStr, password, {}, 'ed25519');
      keyring.saveAccountMeta(pair, {
        name: pair.address,
        img: await generateRandomBase64Avatar()
      });

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { seed: mnemonicsStr, password }
      });
    } else {
      const hex = randomAsHex(32);
      const { pair } = keyring.addUri(
        hex,
        password,
        { img: await generateRandomBase64Avatar() },
        'ed25519'
      );
      keyring.saveAccountMeta(pair, {
        ...pair.meta,
        name: pair.address
      });

      chrome.runtime.sendMessage({ type: Messages.AddToKeyring, payload: { seed: hex, password } });
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
      <SecureWallet
        level={securityLevel}
        setLevel={setSecurityLevel}
        redirectedFromSignUp={redirectedFromSignUp}
      />
      <EncodeAccount
        title="Account Created"
        handleEncode={handleEncode}
        onClose={onClose}
        onBack={onBack}
      />
      <SetupComplete />
    </Wizard>
  );
}
function generateRandomBage64Avatar(): unknown {
  throw new Error('Function not implemented.');
}
