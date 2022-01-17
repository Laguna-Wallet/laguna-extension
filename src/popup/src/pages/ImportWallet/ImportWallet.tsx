import { PageContainer } from 'components/ui';
import WizardStepHeader from 'components/WizardStepHeader/WizardStepHeader';
import { useState } from 'react';
import { useWizard, Wizard } from 'react-use-wizard';
import { ImportType, ImportTypeEnum } from 'utils/types';
import ChooseImportType from './chooseImportType';
import CongratsImportWallet from './congratsImportWallet';
import ImportPhase from './importPhase';

export default function ImportWallet() {
  const [importType, setImportType] = useState<ImportType>(ImportTypeEnum.JSON);

  return (
    <PageContainer>
      <Wizard header={<WizardStepHeader />} footer={<></>}>
        {/* <ChooseImportType setImportType={setImportType} /> */}
        <ImportPhase />
        <CongratsImportWallet />
      </Wizard>
    </PageContainer>
  );
}
