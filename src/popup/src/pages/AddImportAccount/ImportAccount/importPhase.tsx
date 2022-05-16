import { useCallback, useEffect, useState } from 'react';

import FileUploadIcon from 'assets/svgComponents/FileUploadIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import UploadFinishedIcon from 'assets/svgComponents/UploadFinishedIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import WizardHeader from 'pages/AddImportAccount/WizardHeader';
import SignUp from 'pages/SignUp/SignUp';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useWizard } from 'react-use-wizard';
import { reduxForm, change, reset, Field, InjectedFormProps } from 'redux-form';
import styled from 'styled-components';
import { convertUploadedFileToJson, validPassword } from 'utils';
import { isKeyringJson, isValidKeyringPassword } from 'utils/polkadot';
import { mnemonicValidate } from '@polkadot/util-crypto';
import Popup from 'components/Popup/Popup';
import { HelpImport } from 'components/popups/HelpImport';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import { isObjectEmpty, objectToArray } from 'utils';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';

type Props = {
  onClose: () => void;
  redirectedFromSignUp?: boolean;
};

type FormProps ={
  file: KeyringPair$Json | KeyringPairs$Json,
  password: string,
}

function ImportPhase({
  pristine,
  submitting,
  handleSubmit,
  redirectedFromSignUp,
  onClose
}: InjectedFormProps<FormProps> & Props) {
  const { nextStep } = useWizard();

  const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const formValues = useSelector((state: any) => state?.form?.ImportPhase?.values);
  const { seedPhase, file, password }: any = { ...formValues };
  const dispatch = useDispatch();

  const onDrop = useCallback(async (acceptedFile: any) => {
    if (!acceptedFile.length) return;

    const json = await convertUploadedFileToJson(acceptedFile);
    // isKeyringPairs$Json(json) ||
    if (isKeyringJson(json)) {
      setUploaded(true);
      dispatch(change('ImportPhase', 'file', json));
    } else {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid json file');
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: '.json'
  });

  const submit = async (values: FormProps) => {
    const {file, password} = values
    const errors = validPassword(password);

    if (!isObjectEmpty(errors)) {
      const errArray = objectToArray(errors);

      setSnackbarError(errArray[0]);
      setIsSnackbarOpen(true);
      return;
    }

    if (file) {
      const isValid = await isValidKeyringPassword(file, password);
      if (isValid) {
        nextStep();
      } else {
        setIsSnackbarOpen(true);
        setSnackbarError('Invalid password');
        setIsChangeValue(true);
      }
    } else {
      nextStep();
    }
  };

  useEffect(() => {
    const seedLength = seedPhase?.split(' ').filter((item: string) => item?.length).length;

    /* eslint-disable */
    if (seedPhase && /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(seedPhase)) {
      setIsSnackbarOpen(true);
      setSnackbarError('Please remove special characters (!,#:*)');
    } else if ((seedLength === 12 || seedLength === 24) && !mnemonicValidate(seedPhase)) {
      setIsSnackbarOpen(true);
      setSnackbarError('Not a valid blockchain address');
    } else if (seedLength > 12 && !mnemonicValidate(seedPhase)) {
      setIsSnackbarOpen(true);
      setSnackbarError('Please enter 12 or 24 words');
    }
  }, [seedPhase]);

  return (
    <Container>
      <WizardHeader
        title={'IMPORT WALLET'}
        uploaded={uploaded}
        onClose={onClose}
        onBack={() => {
          dispatch(reset('ImportPhase'));
          if (redirectedFromSignUp) {
            goTo(SignUp);
          } else {
            goTo(Wallet);
          }
          // previousStep();
        }}
      />

      <Form onSubmit={handleSubmit(submit)}>
        <DndContainer {...getRootProps()} role={'Box'}>
          {!seedPhase && (
            <FileUploadContainer>
              <input {...getInputProps()} />
              {uploaded ? (
                <IconContainerBorder>
                  <UploadedIconContainer>
                    <UploadFinishedIcon />
                  </UploadedIconContainer>
                </IconContainerBorder>
              ) : (
                <IconContainer onClick={open}>
                  {/* {isDragActive ? <ActiveImportIcon /> : <FileUploadIcon fill="#777e90" />} */}
                  <FileUploadIcon fill="#777e90" />
                </IconContainer>
              )}
              {uploaded ? <Text>Upload Complete</Text> : ''}
            </FileUploadContainer>
          )}
          {!uploaded && (
            <InputContainer>
              <Field
                id="seedPhase"
                name="seedPhase"
                type="textarea"
                label="seedPhase"
                placeholder="Enter your seed phrase, or drag and drop a JSON backup file."
                component={HumbleInput}
                props={{
                  type: 'textarea',
                  fontSize: '18px',
                  marginTop: '20px',
                  textAlign: 'center',
                  bgColor: '#fff',
                  borderColor: '#fff',
                  color: '#b1b5c3',
                  placeholderColor: '#b1b5c3',
                  hideErrorMsg: false,
                  autoFocus: true.valueOf
                }}
              />
            </InputContainer>
          )}
        </DndContainer>
        <HelpButton onClick={() => setIsPopupOpen(true)}>
          <ButtonsIcon fill="#18191a" />
          <span>Help</span>
        </HelpButton>
        {uploaded && (
          <Field
            id="password"
            name="password"
            type="password"
            label="password"
            placeholder="Enter Password for this file"
            component={HumbleInput}
            props={{
              type: 'password',
              height: '45px',
              fontSize: '14px',
              marginTop: '20px',
              textAlign: 'center',
              bgColor: '#f2f2f2',
              errorBorderColor: '#fb5a5a',
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              hideErrorMsg: false,
              autoFocus: true,
              isChangeValue,
              setIsChangeValue
            }}
          />
        )}

        {isPopupOpen && (
          <Popup onClose={() => setIsPopupOpen(false)} bg={'rgba(0, 0, 0, 0.3)'}>
            <HelpImport onClose={() => setIsPopupOpen(false)} />
          </Popup>
        )}

        <Button
          type="submit"
          text="import"
          margin="10px 0 0 0"
          justify="center"
          disabled={pristine || submitting || !password}
          Icon={<RightArrow width={23} fill="#fff" />}
        />

        <Snackbar
          width={'90%'}
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          align="left"
          bottom={seedPhase ? '100px' : file ? '150px' : '100px'}
        />
      </Form>
    </Container>
  );
}

// export default connect((state: State) => ({
//   errors: getFormSyncErrors('ImportPhaze')(state)
// }))();

export default reduxForm<Record<string, unknown>, any>({
  form: 'ImportPhase',
  destroyOnUnmount: false
})(ImportPhase);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #fff;
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const IconContainerBorder = styled.div`
  width: 179px;
  height: 179px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(
    to right top,
    #d7cce2,
    #ddcde1,
    #e3cee0,
    #e8cfdf,
    #edd0dd,
    #f1d1db,
    #f4d2d8,
    #f6d4d6,
    #f8d6d3,
    #f8d8d0,
    #f7dbcd,
    #f5decc
  );
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
    isDragActive || acceptedFilesLength ? '#f9fafb' : '#f9fafb'};
`;

const UploadedIconContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f9fafb;
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
  cursor: pointer;
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  line-height: 1.35;
  text-align: center;
  color: #18191a;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-top: 5px;
  border-radius: 20px;
  background-color: #eeeeee;

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
