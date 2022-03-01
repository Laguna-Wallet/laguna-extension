import ImportPhase from 'pages/AddImportForExistingUsers/importPhase';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Wizard } from 'react-use-wizard';
import { getFormSyncErrors, reduxForm, reset } from 'redux-form';
import styled from 'styled-components';
import { keyExtractSuri, mnemonicValidate, randomAsHex } from '@polkadot/util-crypto';
import { isHex } from '@polkadot/util';

import { Messages, SEED_LENGTHS } from 'utils/types';
import EncodeAccount from './EncodeAccount';
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
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { useAccount } from 'context/AccountContext';
import CreatePassword from '../CreateAccount/CreatePassword/CreatePassword';
import SetupComplete from './SetupComplete';
import SignUp from 'pages/SignUp/SignUp';

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

  const formValues = useSelector((state: any) => state?.form?.AddImportAccount?.values);
  const { seedPhase, file, password: jsonPassword }: any = { ...formValues };

  const handleEncode = async (password: string) => {
    if (seedPhase) {
      if (mnemonicValidate(seedPhase)) {
        importFromMnemonic(seedPhase, password);
      }
      // save from private key
      if (isHex(seedPhase) && isValidPolkadotAddress(seedPhase)) {
        importFromPrivateKey(seedPhase, password);
      }
      // save from public key
      if (!isHex(seedPhase) && isValidPolkadotAddress(seedPhase)) {
        importFromPublicKey(seedPhase);
      }
    }

    if (file) {
      const pair: any = await importJson(
        file as KeyringPair$Json | KeyringPairs$Json | undefined,
        jsonPassword
      );

      encryptKeyringPair(pair, jsonPassword, password);
    }

    dispatch(reset('AddImportAccount'));
    chrome.runtime.sendMessage({ type: Messages.ReopenKeyPairs });
    // reopen keypairs
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
    <Form>
      <Wizard>
        {!encoded && <CreatePassword />}
        <ImportPhase redirectedFromSignUp={redirectedFromSignUp} onClose={onClose} />
        <EncodeAccount handleEncode={handleEncode} onBack={onBack} onClose={onClose} />
        <SetupComplete />
      </Wizard>
    </Form>
  );
}

export default connect((state: any) => ({
  errors: getFormSyncErrors('sendToken')(state)
}))(
  reduxForm<Record<string, unknown>, Props>({
    form: 'AddImportAccount',
    validate,
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true
  })(ImportAccount)
);

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
