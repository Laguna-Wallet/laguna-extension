import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from 'redux-form';
import { Wizard } from 'react-use-wizard';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';
import browser from 'webextension-polyfill';

import { mnemonicValidate } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';
import {
  encryptKeyringPair,
  importFromMnemonic,
  importJson,
  isValidPolkadotAddress
} from 'utils/polkadot';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { Messages, SEED_LENGTHS, StorageKeys } from 'utils/types';

import { State } from 'redux/store';
import { useAccount } from 'context/AccountContext';

import CreatePassword from '../CreateAccount/CreatePassword/CreatePassword';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import ImportPhase from 'pages/AddImportAccount/ImportAccount/importPhase';
import { saveToStorage } from 'utils/chrome';
import { clearAccountsFromStorage } from 'utils';
import { toggleLoading } from 'redux/actions';

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
  redirectedFromForgotPassword?: boolean;
};

function ImportAccount({ redirectedFromSignUp, redirectedFromForgotPassword }: Props) {
  const history = useHistory();

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
        if (redirectedFromForgotPassword) {
          clearAccountsFromStorage(pair.address);
          account.saveActiveAccount(pair);
          dispatch(toggleLoading(true));
        }

        if (!account.getActiveAccount()) {
          account.saveActiveAccount(pair);
        }
        if (redirectedFromForgotPassword) {
          browser.runtime.sendMessage({
            type: Messages.ForgotPassword,
            payload: { seed: seedPhase, password, meta: pair.meta }
          });
        } else {
          browser.runtime.sendMessage({
            type: Messages.AddToKeyring,
            payload: { seed: seedPhase, password, meta: pair.meta }
          });
        }
      }
    } else if (file) {
      const pair: any = await importJson(
        file as KeyringPair$Json | KeyringPairs$Json | undefined,
        jsonPassword
      );

      const newPair = await encryptKeyringPair(pair, jsonPassword, password);

      if (redirectedFromForgotPassword) {
        clearAccountsFromStorage(pair.address);
        account.saveActiveAccount(newPair);
        dispatch(toggleLoading(true));
      }

      if (!account.getActiveAccount()) {
        account.saveActiveAccount(newPair);
      }

      if (redirectedFromForgotPassword) {
        browser.runtime.sendMessage({
          type: Messages.ForgotPassword,
          payload: { password, json: file, jsonPassword, meta: newPair.meta }
        });
      } else {
        browser.runtime.sendMessage({
          type: Messages.AddToKeyring,
          payload: { password, json: file, jsonPassword, meta: newPair.meta }
        });
      }
    }

    browser.runtime.sendMessage({
      type: Messages.AuthUser,
      payload: { password }
    });

    saveToStorage({ key: StorageKeys.OnBoarding, value: true });

    dispatch(reset('ImportPhase'));
    dispatch(reset('EncodeAccount'));

    if (redirectedFromForgotPassword) {
      history.push(router.home);
    }
  };

  const onClose = () => {
    dispatch(reset('ImportPhase'));
    dispatch(reset('EncodeAccount'));
    if (redirectedFromSignUp) {
      history.push(router.signUp);
    } else if (redirectedFromForgotPassword) {
      history.push(router.welcomeBack);
    } else {
      history.push(router.home);
    }
  };

  return (
    <Container>
      <Wizard startIndex={0}>
        {!encoded && <CreatePassword redirectedFromSignUp={redirectedFromSignUp} />}

        <ImportPhase
          redirectedFromForgotPassword={redirectedFromForgotPassword}
          redirectedFromSignUp={redirectedFromSignUp}
          onClose={onClose}
        />

        {!redirectedFromForgotPassword && (
          <EncodeAccount
            title="Import Complete!"
            descriptionText="To encrypt your new account please enter your password below:"
            handleEncode={handleEncode}
          />
        )}

        {redirectedFromForgotPassword && (
          <CreatePassword
            handleEncode={handleEncode}
            redirectedFromForgotPassword={redirectedFromForgotPassword}
          />
        )}

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
