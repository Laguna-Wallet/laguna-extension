import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'redux-form';
import { Wizard } from 'react-use-wizard';
import { goTo } from 'react-chrome-extension-router';

import { mnemonicValidate } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';
import {
  encryptKeyringPair,
  importFromMnemonic,
  importJson,
  isValidPolkadotAddress,
} from 'utils/polkadot';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { Messages, SEED_LENGTHS, StorageKeys } from 'utils/types';

import { State } from 'redux/store';
import { useAccount } from 'context/AccountContext';

import CreatePassword from '../CreateAccount/CreatePassword/CreatePassword';
import SignUp from 'pages/SignUp/SignUp';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import ImportPhase from 'pages/AddImportAccount/ImportAccount/importPhase';
import Wallet from 'pages/Wallet/Wallet';
import { saveToStorage } from 'utils/chrome';

const validate = (values: any) => {
  const errors: any = {};

  if (values.seedPhase) {
    if (
      !isHex(values.seedPhase) &&
      !isValidPolkadotAddress(values.seedPhase) &&
      !mnemonicValidate(values.seedPhase)
    ) {
      errors.seedPhase = `Please enter mnemonic seed or valid public address or private key`;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/g.test(values.seedPhase.toString())) {
      errors.seedPhase = `Please remove special characters (!,#:*)`;
    }

    if (
      values.seedPhase.split(' ').length > 2 &&
      !SEED_LENGTHS.includes(values.seedPhase.split(' ').length)
    ) {
      errors.seedPhase = `Please enter 12 or 24 words`;
    }
  }

  return errors;
};

type Props = {
  redirectedFromSignUp?: boolean;
};

function ImportAccount({ redirectedFromSignUp }: Props) {
  const account = useAccount();
  const encoded = account.encryptedPassword;

  const dispatch = useDispatch();

  const importPhaseFormValues = useSelector((state: any) => state?.form?.ImportPhase?.values);
  const hasBoarded = useSelector((state: State) => state.wallet.onboarding);

  const { seedPhase, file, password: jsonPassword }: any = { ...importPhaseFormValues };

  const handleEncode = async (password: string) => {
    if (seedPhase) {
      if (mnemonicValidate(seedPhase)) {
        const pair = await importFromMnemonic(seedPhase, password);

        if (!account.getActiveAccount()) {
          account.saveActiveAccount(pair);
        }

        chrome.runtime.sendMessage({
          type: Messages.AddToKeyring,
          payload: { seed: seedPhase }
        });
      }
    }

    if (file) {
      const pair: any = await importJson(
        file as KeyringPair$Json | KeyringPairs$Json | undefined,
        jsonPassword
      );

      const newPair = await encryptKeyringPair(pair, jsonPassword, password);

      if (!account.getActiveAccount()) {
        account.saveActiveAccount(newPair);
      }

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { password, json: file, jsonPassword }
      });
    }

    saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });

    dispatch(reset('ImportPhase'));
    dispatch(reset('EncodeAccount'));
  };

  const onClose = () => {
    dispatch(reset('ImportPhase'));
    dispatch(reset('EncodeAccount'));
    if (redirectedFromSignUp) {
      goTo(SignUp);
    } else {
      goTo(Wallet);
    }
  };

  return (
    <Container>
      <Wizard>
        {!encoded && <CreatePassword />}
        <ImportPhase redirectedFromSignUp={redirectedFromSignUp} onClose={onClose} />
        <EncodeAccount
          title="Import Complete!"
          handleEncode={handleEncode}
        />
        {!hasBoarded && <SetupComplete />}
      </Wizard>
    </Container>
  );
}

export default ImportAccount;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
