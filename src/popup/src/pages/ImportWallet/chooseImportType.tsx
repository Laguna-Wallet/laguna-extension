import { ArrowSmRightIcon } from '@heroicons/react/outline';
import RightArrow from 'assets/svgComponents/RightArrow';
import Button from 'components/primitives/Button';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { ImportType, ImportTypeEnum } from 'utils/types';

type Props = {
  setImportType: (type: ImportType) => void;
};

export default function ChooseImportType({ setImportType }: Props) {
  const { nextStep } = useWizard();

  const handleSetImportType = (importType: ImportType) => {
    setImportType(importType);
    nextStep();
  };

  return (
    <Container>
      <Button
        bgColor="#fff"
        color="#111"
        borderColor="#111"
        onClick={() => handleSetImportType(ImportTypeEnum.JSON)}
        text="Import Via Json"
        Icon={<RightArrow width={23} />}
      />
      <Button
        onClick={() => handleSetImportType(ImportTypeEnum.SEED)}
        text="Import Via Seed Phase"
        Icon={<RightArrow width={23} />}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
