import keyring from '@polkadot/ui-keyring';
import { PageContainer } from 'components/ui';
import WizardStepHeader from 'components/WizardStepHeader/WizardStepHeader';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import { mnemonicGenerate } from '@polkadot/util-crypto/mnemonic';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { Wizard } from 'react-use-wizard';
import CongratsSecuringWallet from './Congrats/CongratsSecuringWallet';
import CreatePassword from './CreatePassword/CreatePassword';
import SecureWallet from './SecureWallet/SecureWallet';
import { randomAsHex } from '@polkadot/util-crypto';
import SignUp from 'pages/SignUp/SignUp';
import { useState } from 'react';
import { Messages, StorageKeys } from 'utils/types';
import { generateRandomBase64Avatar } from 'utils';
import { addAccountMeta } from 'utils/polkadot';
import { useSelector } from 'react-redux';
import { State } from 'redux/store';
import AES from 'crypto-js/aes';
import CongratsBackingUp from './SecureWallet/CongratsBackingUp';
import { saveToStorage } from 'utils/chrome';

type Props = {
  existingAccount?: boolean;
  encodePhase?: boolean;
  redirectedFromSignUp?: boolean;
  redirectedFromDashboard?: boolean;
};

export enum SecurityLevelEnum {
  Secured = 'Secured',
  Skipped = 'Skipped'
}

export default function CreateAccount({
  redirectedFromSignUp,
  redirectedFromDashboard,
  encodePhase
}: Props) {
  const account = useAccount();
  const encoded = account.encryptedPassword;

  const hasBoarded = useSelector((state: State) => state?.wallet?.onboarding);

  const [securityLevel, setSecurityLevel] = useState<
    SecurityLevelEnum.Secured | SecurityLevelEnum.Skipped
  >(SecurityLevelEnum.Secured);

  const handleEncode = async (password: string) => {
    // note for now seed creation flow saves mnemonic in Account Context
    // would be better to refactor and save data in redux, (just for flow)

    if (securityLevel === SecurityLevelEnum.Secured && account?.mnemonics) {
      const mnemonicsStr = account?.mnemonics.join(' ');
      const encodedSeed = AES.encrypt(account?.mnemonics.join(' '), password).toString();

      const { pair } = keyring.addUri(mnemonicsStr, password, {
        encodedSeed,
        img: await generateRandomBase64Avatar()
      });

      const newPair = addAccountMeta(pair.address, {
        name: pair.address
      });

      if (!account.getActiveAccount()) {
        account.saveActiveAccount(newPair);
      }

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { seed: mnemonicsStr, password, meta: newPair.meta }
      });

      chrome.runtime.sendMessage({
        type: Messages.AuthUser,
        payload: { password }
      });

      saveToStorage({ key: StorageKeys.OnBoarding, value: true });
    } else {
      const mnemonicsStr = account?.generateMnemonics().join(' ');
      const encodedSeed = AES.encrypt(mnemonicsStr, password).toString();

      const { pair } = keyring.addUri(mnemonicsStr, password, {
        encodedSeed,
        img: await generateRandomBase64Avatar(),
        notSecured: true
      });

      const newPair = addAccountMeta(pair.address, {
        name: pair.address
      });

      if (!account.getActiveAccount()) {
        account.saveActiveAccount(newPair);
      }

      chrome.runtime.sendMessage({
        type: Messages.AuthUser,
        payload: { password }
      });

      saveToStorage({ key: StorageKeys.OnBoarding, value: true });

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { seed: mnemonicsStr, password, meta: newPair.meta }
      });
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
    <Wizard startIndex={0}>
      {!encoded && <CreatePassword redirectedFromSignUp={redirectedFromSignUp} />}

      <SecureWallet
        level={securityLevel}
        setLevel={setSecurityLevel}
        redirectedFromSignUp={redirectedFromSignUp}
        redirectedFromDashboard={redirectedFromDashboard}
      />

      {!redirectedFromDashboard && (
        <EncodeAccount
          title="Account Created!"
          descriptionText="To encrypt your new account please enter your password below:"
          handleEncode={handleEncode}
          onClose={onClose}
          onBack={onBack}
        />
      )}

      {redirectedFromDashboard && <SetupComplete />}

      {!hasBoarded && <SetupComplete />}
    </Wizard>
  );
}
