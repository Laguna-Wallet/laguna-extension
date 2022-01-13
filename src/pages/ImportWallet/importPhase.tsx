import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import ActiveImportIcon from 'assets/svgComponents/ActiveImportIcon';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import FileUploadIcon from 'assets/svgComponents/FileUploadIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import UploadFinishedIcon from 'assets/svgComponents/UploadFinishedIcon';
import Dnd from 'components/Dnd/Dnd';
import Button from 'components/primitives/Button';
import Input from 'components/primitives/Input';
import Snackbar from 'components/Snackbar/Snackbar';
import { useFormik } from 'formik';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useWizard } from 'react-use-wizard';
import styled from 'styled-components';
import { convertUploadedFileToJson } from 'utils';
import { saveToStorage } from 'utils/chrome';
import { importJson, seedValidate, validateSeed } from 'utils/polkadot';
import { StorageKeys } from 'utils/types';
import { validateSeedPhase } from 'utils/validations';

export default function ImportPhase() {
  const { nextStep } = useWizard();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFile) => {
    const json = await convertUploadedFileToJson(acceptedFile);
    formik.setFieldValue('file', json);
    // setFile(json as KeyringPair$Json | KeyringPairs$Json);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, acceptedFiles, open } =
    useDropzone({
      onDrop,
      noClick: true
    });

  const formik = useFormik({
    initialValues: {
      seedPhase: '',
      password: '',
      file: undefined
    },
    validate: validateSeedPhase,
    // validationSchema: welcomeBackSchema,
    onSubmit: async ({ seedPhase, file, password }) => {
      try {
        if (file) {
          const res = await importJson(
            file as KeyringPair$Json | KeyringPairs$Json | undefined,
            password
          );
        } else {
          seedValidate(seedPhase);
        }

        saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
        nextStep();
      } catch (err: any) {
        // todo proper typing
        setIsSnackbarOpen(true);
        setSnackbarError(err.message);
      }
    }
  });

  // todo refactor this function
  const isDisabled = () => {
    if (!validateSeed(formik.values.seedPhase) || !(acceptedFiles.length > 0)) return false;
    return true;
  };

  const fileUploaded = !!(acceptedFiles.length > 0);

  useEffect(() => {
    if (formik.errors.seedPhase && !isSnackbarOpen) {
      setIsSnackbarOpen(true);
      setSnackbarError(formik.errors.seedPhase);
    }
  }, [formik.errors.seedPhase]);

  return (
    <Container>
      <Form onSubmit={formik.handleSubmit}>
        <DndContainer {...getRootProps()} role={'Box'}>
          {!formik.values.seedPhase && (
            <FileUploadContainer>
              <input {...getInputProps()} />
              {fileUploaded ? (
                <IconContainerBorder>
                  <UploadedIconContainer>
                    <UploadFinishedIcon />
                  </UploadedIconContainer>
                </IconContainerBorder>
              ) : (
                <IconContainer onClick={open}>
                  {isDragActive ? <ActiveImportIcon /> : <FileUploadIcon />}
                </IconContainer>
              )}
              {fileUploaded ? <Text>Upload Complete</Text> : ''}
            </FileUploadContainer>
          )}

          {!fileUploaded && (
            <InputContainer>
              <Input
                type="textarea"
                id="seedPhase"
                placeholder="Enter your seed phrase, private key, Polkadot address or drag and drop a JSON backup file."
                onChange={formik.handleChange}
                value={formik.values.seedPhase}
                height={'120px'}
                fontSize="20px"
                marginTop="20px"
                textAlign="center"
                bgColor="#f8f8f8"
                hideErrorMsg={false}
                autoFocus={true}
              />
            </InputContainer>
          )}
        </DndContainer>

        {fileUploaded && (
          <Input
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            placeholder="password"
            label="Password"
            error={formik.errors.password}
            touched={formik.touched.password}
            height="50px"
            autoFocus={true}
          />
        )}

        <Button
          disabled={isDisabled()}
          type="submit"
          text="import"
          Icon={<RightArrow width={23} fill="#fff" />}
        />
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="0px"
          bottom={formik.values.seedPhase ? '50px' : formik.values.file ? '120px' : '50px'}>
          <CloseIconContainer>
            <CloseIcon stroke="#111" />
          </CloseIconContainer>
          <ErrorMessage>{snackbarError}</ErrorMessage>
        </Snackbar>

        {/* <Input /> */}
      </Form>
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

const IconContainerBorder = styled.div`
  width: 179px;
  height: 179px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(146deg, #1cc3ce -9%, #b5f400 118%);
  padding: 5px;
  border-radius: 100%;
`;

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const DndContainer = styled.div`
  width: 100%;
  /* height: 100%; */
  flex: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  flex-direction: column;
`;

const IconContainer = styled.div<{ isDragActive?: boolean; acceptedFilesLength?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ acceptedFilesLength }) => (acceptedFilesLength ? '60px' : '25px')};
  box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 100%;
  cursor: pointer;
  background-color: ${({ isDragActive, acceptedFilesLength }) =>
    isDragActive || acceptedFilesLength ? '#f4f4f6' : '#f4f4f6'};
`;

const UploadedIconContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f4f4f6;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.div`
  font-family: 'SFCompactDisplayRegular';
  font-size: 20px;
  margin-top: 10px;
`;

const FileUploadContainer = styled.div``;

const InputContainer = styled.div`
  width: 100%;
`;

const HelpButton = styled.div`
  width: 70px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #eeeeee;
  color: #111;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  span {
    margin-left: 5px;
  }
`;

const ErrorMessage = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-left: 10px;
`;

const CloseIconContainer = styled.div`
  width: 30px;
  height: 25px;
  background-color: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
