import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';
import { Wizard } from 'react-use-wizard';
import AddImport from './AddImport';
import ImportPhase from 'pages/ImportWallet/importPhase';
import { useState } from 'react';
import { connect } from 'react-redux';
import { getFormSyncErrors, reduxForm } from 'redux-form';
import EncodeAccount from './EncodeAccount';
import { SEED_LENGTHS } from 'utils/types';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
import ImportAccount from './ImportAccount';

export enum PhaseEnum {
  Import = 'Import',
  Create = 'Create'
}

function AddImportForExistingUsers() {
  const [phase, setPhase] = useState<string>('');

  return (
    <Wizard>
      <AddImport setPhase={setPhase} />
      {phase === PhaseEnum.Import ? <ImportAccount /> : <CreateAccount existingAccount={false} />}
    </Wizard>
  );
}

export default AddImportForExistingUsers;
