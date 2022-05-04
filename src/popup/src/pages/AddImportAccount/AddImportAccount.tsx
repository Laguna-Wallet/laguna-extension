import { Wizard } from 'react-use-wizard';
// import AddImport from './ChooseAddImport';
import { useState } from 'react';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
// import ImportAccount from './ImportAccount';

export enum PhaseEnum {
  Import = 'Import',
  Create = 'Create'
}

function AddImportForExistingUsers() {
  const [phase, setPhase] = useState<string>('');

  return (
    <Wizard>
      {/* <AddImport setPhase={setPhase} />
      {phase === PhaseEnum.Import ? <ImportAccount /> : <CreateAccount existingAccount={false} />} */}
    </Wizard>
  );
}

export default AddImportForExistingUsers;
