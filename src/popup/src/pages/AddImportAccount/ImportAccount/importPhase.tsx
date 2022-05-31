import { useCallback, useEffect, useState } from 'react';

import FileUploadIcon from 'assets/svgComponents/FileUploadIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import UploadFinishedIcon from 'assets/svgComponents/UploadFinishedIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import WizardHeader from 'pages/AddImportAccount/WizardHeader';
import SignUp from 'pages/SignUp/SignUp';
import { goTo } from 'react-chrome-extension-router';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useWizard } from 'react-use-wizard';
import { reduxForm, change, reset, Field, InjectedFormProps } from 'redux-form';
import styled from 'styled-components';
import { convertUploadedFileToJson } from 'utils';
import { isKeyringJson, isValidKeyringPassword, isValidPolkadotAddress } from 'utils/polkadot';
import { mnemonicValidate } from '@polkadot/util-crypto';
import Popup from 'components/Popup/Popup';
import { HelpImport } from 'components/popups/HelpImport';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { isHex } from '@polkadot/util';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import AddImportForBoardedUser from '../AddImportForBoardedUser';
import { useEnterClickListener } from 'hooks/useEnterClickListener';

type Props = {
  onClose: () => void;
  redirectedFromSignUp?: boolean;
  redirectedFromForgotPassword?: boolean;
};

type FormProps = {
  file: KeyringPair$Json | KeyringPairs$Json;
  password: string;
};

function ImportPhase({
  handleSubmit,
  redirectedFromSignUp,
  redirectedFromForgotPassword,
  onClose
}: InjectedFormProps<FormProps> & Props) {
  const { nextStep } = useWizard();

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [isFinishSlider, setIsFinishSlider] = useState(false);
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
      setIsFinishSlider(true);
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

  const submit = async (values?: FormProps) => {
    if (file) {
      const isValid = await isValidKeyringPassword(file, password);
      if (isValid) {
        nextStep();
      } else {
        if (password) {
          setIsSnackbarOpen(true);
          setSnackbarError('Incorrect password');
        }
      }
    } else if (!isDisabled) {
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
    } else if ((seedLength === 12 || seedLength === 24) && mnemonicValidate(seedPhase)) {
      setIsFinishSlider(true);
    }
  }, [seedPhase]);

  const isDisabled =
    !isKeyringJson(file) &&
    !isHex(seedPhase) &&
    !isValidPolkadotAddress(seedPhase) &&
    !mnemonicValidate(seedPhase);

  const onBack = () => {
    if (redirectedFromSignUp) {
      goTo(SignUp);
    } else if (redirectedFromForgotPassword) {
      goTo(WelcomeBack);
    } else {
      if (seedPhase || file) {
        dispatch(reset('ImportPhase'));
        setUploaded(false);
      } else {
        goTo(AddImportForBoardedUser);
      }
    }
  };

  useEnterClickListener(() => {
    submit();
  }, [file, isDisabled, password]);

  return (
    <Container>
      <WizardHeader
        title={redirectedFromForgotPassword ? 'RESTORE WALLET' : 'IMPORT ACCOUNT'}
        isFinishSlider={isFinishSlider}
        isImportPhase
        onClose={onClose}
        onBack={onBack}
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
                  color: isDisabled ? '#b1b5c3' : '#111',
                  placeholderColor: '#b1b5c3',
                  hideErrorMsg: false,
                  autoFocus: true.valueOf
                }}
              />
            </InputContainer>
          )}
        </DndContainer>
        {!uploaded && !seedPhase && (
          <HelpButton onClick={() => setIsPopupOpen(true)}>
            <ButtonsIcon fill="#18191a" />
            <span>Help</span>
          </HelpButton>
        )}
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
              autoFocus: true
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
          text="Import"
          margin="10px 0 0 0"
          justify="center"
          // styledDisabled={uploaded ? !(uploaded && password) : !seedPhase}
          styledDisabled={isDisabled}
          Icon={<RightArrow width={23} fill="#fff" />}
        />

        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          align="left"
          bottom={file ? '148px' : '100px'}
        />
      </Form>
    </Container>
  );
}

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
  padding: 30px 26px 38px;
  box-sizing: border-box;
`;

const IconContainerBorder = styled.div`
  width: 212px;
  height: 212px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    223.89deg,
    #f5decc 1.96%,
    #f2d2db 23.9%,
    #d7cce2 48.8%,
    #c7dfe4 73.7%,
    #edf1e1 96.23%,
    #ffffff 115.8%
  );
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
  min-width: 179px;
  min-height: 179px;
  background-color: #f9fafb;
  border-radius: 100%;
  display: flex;
  align-items: center;
  border: 8px solid #fff;
  justify-content: center;
`;

const Text = styled.div`
  font-family: 'Inter';
  font-size: 18px;
  margin-top: 35.5px;
  color: #18191a;
  line-height: 1.35;
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
