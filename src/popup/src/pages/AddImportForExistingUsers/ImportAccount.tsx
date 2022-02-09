import ImportPhase from 'pages/ImportWallet/importPhase';
import React from 'react';
import { connect } from 'react-redux';
import { Wizard } from 'react-use-wizard';
import { getFormSyncErrors, reduxForm } from 'redux-form';
import styled from 'styled-components';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { SEED_LENGTHS } from 'utils/types';
import EncodeAccount from './EncodeAccount';

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
  return (
    <Form>
      <Wizard>
        <ImportPhase />
        <EncodeAccount />
        <div>sagol dsma</div>
      </Wizard>
      ;
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
