import { PlusIcon } from '@heroicons/react/outline';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import ActiveImportIcon from 'assets/svgComponents/ActiveImportIcon';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import FileUploadIcon from 'assets/svgComponents/FileUploadIcon';
import RightArrow from 'assets/svgComponents/RightArrow';
import UploadFinishedIcon from 'assets/svgComponents/UploadFinishedIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import WizardHeader from 'pages/AddImportForExistingUsers/WizardHeader';
import SignUp from 'pages/SignUp/SignUp';
import Wallet from 'pages/Wallet/Wallet';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useDropzone } from 'react-dropzone';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useWizard } from 'react-use-wizard';
import { change, reset, Field, FormErrors, getFormSyncErrors } from 'redux-form';
import styled from 'styled-components';
import { convertUploadedFileToJson, objectToArray } from 'utils';
import { saveToStorage } from 'utils/chrome';
import {
  importJson,
  isKeyringJson,
  isKeyringPairs$Json,
  isValidKeyringPassword,
  isValidPolkadotAddress,
  validateSeed
} from 'utils/polkadot';
import { isHex } from '@polkadot/util';
import { mnemonicValidate } from '@polkadot/util-crypto';
import { StorageKeys } from 'utils/types';
import Popup from 'components/Popup/Popup';
import { HelpImport } from 'components/popups/HelpImport';
import { State } from 'redux/store';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';

// import { StorageKeys } from 'utils/types';
// import { validateSeedPhase } from 'utils/validations';

type Props = {
  errors: FormErrors<Record<string, unknown>, string>;
  onClose: () => void;
  redirectedFromSignUp?: boolean;
};

function ImportPhase({ errors, onClose, redirectedFromSignUp }: Props) {
  const { nextStep } = useWizard();

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const formValues = useSelector((state: any) => state?.form?.AddImportAccount?.values);
  const { seedPhase, file, password }: any = { ...formValues };
  const dispatch = useDispatch();

  const onDrop = useCallback(async (acceptedFile: any) => {
    if (!acceptedFile.length) return;

    const json = await convertUploadedFileToJson(acceptedFile);
    // isKeyringPairs$Json(json) ||
    if (isKeyringJson(json)) {
      setUploaded(true);
      dispatch(change('AddImportAccount', 'file', json));
    } else {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid json file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, acceptedFiles, open } =
    useDropzone({
      onDrop,
      noClick: true,
      accept: '.json'
    });

  const isDisabled = () => {
    if (
      !isKeyringJson(file) &&
      !isHex(seedPhase) &&
      !isValidPolkadotAddress(seedPhase) &&
      !mnemonicValidate(seedPhase)
    )
      return true;
    return false;
  };

  // todo proper typing
  const handleClick = async ({ seedPhase, file, password }: any) => {
    try {
      if (file) {
        const isValid = await isValidKeyringPassword(file, password);
        if (isValid) {
          nextStep();
        } else {
          setIsSnackbarOpen(true);
          setSnackbarError('Invalid password');
        }
      } else {
        nextStep();
      }
      saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
    } catch (err: any) {
      // todo proper error typing
      setIsSnackbarOpen(true);
      setSnackbarError(err.message);
    }
  };

  // listen to enter click
  useEffect(() => {
    if (errors?.seedPhase && !isSnackbarOpen) {
      const errorsArr = objectToArray(errors);
      setIsSnackbarOpen(true);
      setSnackbarError(errorsArr[0]);
    }
  }, [errors]);

  const handleUserKeyPress = useCallback((event, isDisabled) => {
    const { keyCode } = event;

    if (keyCode === 13 && isDisabled) {
      handleClick({ seedPhase, file, password });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', (e) => handleUserKeyPress(e, isDisabled));
    return () => {
      window.removeEventListener('keydown', (e) => handleUserKeyPress(e, isDisabled));
    };
  }, [handleUserKeyPress]);

  return (
    <Container>
      <WizardHeader
        title={'IMPORT WALLET'}
        onClose={onClose}
        onBack={() => {
          dispatch(reset('AddImportAccount'));
          if (redirectedFromSignUp) {
            goTo(SignUp);
          } else {
            goTo(Wallet);
          }
          // previousStep();
        }}
      />

      <Content>
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
                  height: '80px',
                  fontSize: '18px',
                  marginTop: '20px',
                  textAlign: 'center',
                  bgColor: '#fff',
                  borderColor: '#fff',
                  color: '#b1b5c3',
                  placeholderColor: '#b1b5c3',
                  hideErrorMsg: false,
                  autoFocus: true
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
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              hideErrorMsg: false,
              autoFocus: true
            }}
          />
        )}

        {isPopupOpen && (
          <Popup onClose={() => setIsPopupOpen(false)}>
            <HelpImport onClose={() => setIsPopupOpen(false)} />
          </Popup>
        )}

        <Button
          onClick={() => handleClick({ seedPhase, file, password })}
          type="button"
          disabled={isDisabled()}
          text="import"
          margin="10px 0 0 0"
          justify="center"
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
      </Content>
    </Container>
  );
}

export default connect((state: State) => ({
  errors: getFormSyncErrors('AddImportAccount')(state)
}))(ImportPhase);

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

const Content = styled.div`
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
