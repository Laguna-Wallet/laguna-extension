import keyring from '@polkadot/ui-keyring';
import { useAccount } from 'context/AccountContext';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import { Wizard } from 'react-use-wizard';
import CreatePassword from './CreatePassword/CreatePassword';
import SecureWallet from './SecureWallet/SecureWallet';
import { useState } from 'react';
import { Messages, StorageKeys } from 'utils/types';
import { generateRandomBase64Avatar, isObjectEmpty } from 'utils';
import { addAccountMeta } from 'utils/polkadot';
import { useSelector } from 'react-redux';
import { State } from 'redux/store';
import AES from 'crypto-js/aes';
import { saveToStorage } from 'utils/chrome';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { router } from 'router/router';
import browser from 'webextension-polyfill';
import { useLocation } from 'react-router-dom';
import { generateNewWalletAddress } from 'utils/ethereumUtils/ethereumApi';

type Props = {
  existingAccount?: boolean;
  encodePhase?: boolean;
};

type LocationState = {
  redirectedFromSignUp?: boolean;
  redirectedFromDashboard?: boolean;
};

export enum SecurityLevelEnum {
  Secured = 'Secured',
  Skipped = 'Skipped'
}

export default function CreateAccount({
  // redirectedFromSignUp,
  // redirectedFromDashboard,
  encodePhase
}: Props & Partial<RouteComponentProps>) {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const encoded = account.encryptedPassword;
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { redirectedFromSignUp, redirectedFromDashboard } = location?.state || {};

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

      const ethAddress = generateNewWalletAddress(mnemonicsStr)?.address;

      const { pair } = keyring.addUri(mnemonicsStr, password, {
        encodedSeed,
        img: await generateRandomBase64Avatar(),
        ethAddress
      });

      const newPair = addAccountMeta(pair.address, {
        name: pair.address
      });

      if (!activeAccount || (activeAccount && isObjectEmpty(activeAccount))) {
        account.saveActiveAccount(newPair);
      }

      browser.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { seed: mnemonicsStr, password, meta: newPair.meta }
      });

      browser.runtime.sendMessage({
        type: Messages.AuthUser,
        payload: { password }
      });

      saveToStorage({ key: StorageKeys.OnBoarding, value: true });
    } else {
      const mnemonicsStr = account?.generateMnemonics().join(' ');
      const encodedSeed = AES.encrypt(mnemonicsStr, password).toString();

      const ethAddress = generateNewWalletAddress(mnemonicsStr)?.address;

      const { pair } = keyring.addUri(mnemonicsStr, password, {
        encodedSeed,
        img: await generateRandomBase64Avatar(),
        notSecured: true,
        ethAddress
      });

      const newPair = addAccountMeta(pair.address, {
        name: pair.address
      });

      if (!activeAccount || (activeAccount && isObjectEmpty(activeAccount))) {
        account.saveActiveAccount(newPair);
      }

      browser.runtime.sendMessage({
        type: Messages.AuthUser,
        payload: { password }
      });

      saveToStorage({ key: StorageKeys.OnBoarding, value: true });

      browser.runtime.sendMessage({
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
      history.push(router.signUp);
    } else {
      history.push(router.home);
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
