import styled from 'styled-components';
import { connect, useDispatch, useSelector } from 'react-redux';
import { getFormSyncErrors, reduxForm, reset } from 'redux-form';
import { Wizard } from 'react-use-wizard';
import { goTo } from 'react-chrome-extension-router';

import { keyExtractSuri, mnemonicValidate, randomAsHex } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';
import {
  accountsChangePassword,
  encryptKeyringPair,
  importFromMnemonic,
  importFromPrivateKey,
  importFromPublicKey,
  importJson,
  importViaSeed,
  isValidPolkadotAddress,
  // unlockAndSavePair,
  validatePassword
} from 'utils/polkadot';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { Messages, SEED_LENGTHS } from 'utils/types';

import { State } from 'redux/store';

import { useAccount } from 'context/AccountContext';

import CreatePassword from '../CreateAccount/CreatePassword/CreatePassword';
import SignUp from 'pages/SignUp/SignUp';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import ImportPhase from 'pages/ImportAccount/importPhase';
import Wallet from 'pages/Wallet/Wallet';

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
  // todo proper typing
  const formValues = useSelector((state: any) => state?.form?.AddImportAccount?.values);
  const hasBoarded = useSelector((state: State) => state.wallet.onboarding);

  const { seedPhase, file, password: jsonPassword }: any = { ...formValues };

  const handleEncode = async (password: string) => {
    if (seedPhase) {
      if (mnemonicValidate(seedPhase)) {
        importFromMnemonic(seedPhase, password);
      }
      // save from private key
      // if (isHex(seedPhase) && isValidPolkadotAddress(seedPhase)) {
      //   importFromPrivateKey(seedPhase, password);
      // }
      // save from public key
      if (!isHex(seedPhase) && isValidPolkadotAddress(seedPhase)) {
        importFromPublicKey(seedPhase);
      }

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { seed: seedPhase }
      });
    }

    if (file) {
      const pair: any = await importJson(
        file as KeyringPair$Json | KeyringPairs$Json | undefined,
        jsonPassword
      );

      encryptKeyringPair(pair, jsonPassword, password);

      chrome.runtime.sendMessage({
        type: Messages.AddToKeyring,
        payload: { password, json: file, jsonPassword }
      });
    }

    dispatch(reset('AddImportAccount'));
  };

  const onClose = () => {
    dispatch(reset('AddImportAccount'));
    if (redirectedFromSignUp) {
      goTo(SignUp);
    } else {
      goTo(Wallet);
    }
  };

  const onBack = (backAction: () => void) => {
    dispatch(reset('AddImportAccount'));
    backAction();
  };

  return (
    <Container>
      <Wizard>
        {!encoded && <CreatePassword />}
        <ImportPhase redirectedFromSignUp={redirectedFromSignUp} onClose={onClose} />
        <EncodeAccount
          title="Import Complete!"
          handleEncode={handleEncode}
          onBack={onBack}
          onClose={onClose}
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
