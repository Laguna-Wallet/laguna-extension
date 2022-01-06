import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { importJson } from 'utils/polkadot';
import { convertUploadedFileToJson } from 'utils';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import Input from 'components/primitives/Input';
import FileUploadIcon from 'assets/svgComponents/FileUploadIcon';

type Props = {
  setFile: (file: KeyringPair$Json | KeyringPairs$Json) => void;
};

export default function Dnd({ setFile }: Props) {
  return <Container>Dnd</Container>;
}

const Container = styled.div`
  width: 100%;
  height: 180px;
  margin-bottom: 50px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
`;
