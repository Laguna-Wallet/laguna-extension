import ImportPhase from 'pages/ImportWallet/importPhase';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Wizard } from 'react-use-wizard';
import { getFormSyncErrors, reduxForm, reset } from 'redux-form';
import styled from 'styled-components';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { SEED_LENGTHS } from 'utils/types';
import EncodeAccount from './EncodeAccount';
import { importJson, importViaSeed, validatePassword } from 'utils/polkadot';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { useAccount } from 'context/AccountContext';
import CreatePassword from '../CreateAccount/CreatePassword/CreatePassword';
import SetupComplete from './SetupComplete';

const validate = (values: any) => {
  const errors: any = {};

  if (values.seedPhase) {
    if (!mnemonicValidate(values.seedPhase)) {
      errors.seedPhase = `Not a valid mnemonic seed`;
    }

    if (!SEED_LENGTHS.includes(values.seedPhase.split(' ').length)) {
      errors.seedPhase = `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/g.test(values.seedPhase.toString())) {
      errors.seedPhase = `Please remove special characters (!,#:*)`;
    }
  }

  return errors;
};

function ImportAccount() {
  const account = useAccount();
  const encoded = account.getEncryptedPassword();

  const dispatch = useDispatch();

  const formValues = useSelector((state: any) => state?.form?.AddImportAccount?.values);
  const { seedPhase, file, password: jsonPassword }: any = { ...formValues };

  const handleEncode = async (password: string) => {
    if (file) {
      await importJson(file as KeyringPair$Json | KeyringPairs$Json | undefined, jsonPassword);
    } else {
      importViaSeed(seedPhase, password);
    }
  };

  const onClose = () => {
    dispatch(reset('AddImportAccount'));
    goTo(Wallet);
  };

  const onBack = (backAction: () => void) => {
    dispatch(reset('AddImportAccount'));
    backAction();
  };

  return (
    <Form>
      <Wizard>
        {!encoded && <CreatePassword />}
        <ImportPhase />
        <EncodeAccount handleEncode={handleEncode} onBack={onBack} onClose={onClose} />
        <SetupComplete />
      </Wizard>
    </Form>
  );
}

export default connect((state: any) => ({
  errors: getFormSyncErrors('sendToken')(state)
}))(
  reduxForm<Record<string, unknown>, Record<string, unknown>>({
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
