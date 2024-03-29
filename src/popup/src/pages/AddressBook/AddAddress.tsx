import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useFormik } from 'formik';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import { addAddressSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import AddBigIcon from 'assets/svgComponents/AddBigIcon';
import { objectValuesToArray } from 'utils';
import keyring from '@polkadot/ui-keyring';
import EditBigIcon from 'assets/svgComponents/EditBigIcon';
import { addressExists, isValidPolkadotAddress } from 'utils/polkadot';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';
import { SnackbarMessages } from 'utils/types';

type AddAddressFormikValues = {
  name: string;
  address: string;
  memo: string;
};

type Props = {
  name?: string;
  address?: string;
  memo?: string;
  edit?: boolean;
  redirectedFromSend?: boolean;
  backAction?: any;
  closeAction?: () => void;
};

export default function AddAddress({
  name,
  address,
  memo,
  edit,
  backAction,
  closeAction,
  redirectedFromSend
}: Props) {
  const history = useHistory();
  const { location } = history as any;

  const editAddress = edit || location?.state?.edit;

  const state = location?.state;

  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const formik = useFormik<AddAddressFormikValues>({
    initialValues: {
      name: name || state?.address?.name || '',
      address: address || state?.address?.address || '',
      memo: memo || state?.address?.memo || ''
    },
    validationSchema: addAddressSchema,
    onSubmit: ({ address: newAddress, name: newAddressName, memo: newMemo }) => {
      // if(address is correct address)
      // Snackbar

      const isValidAddress = isValidPolkadotAddress(newAddress);
      if (!isValidAddress) {
        setIsSnackbarOpen(true);
        setSnackbarError('Enter correct address');
        return;
      }

      if (!editAddress && addressExists(newAddress)) {
        setIsSnackbarOpen(true);
        setSnackbarError('Address already exists');
        return;
      }

      if (editAddress && address) {
        keyring.forgetAddress(address);
      }

      keyring.saveAddress(newAddress, { name: newAddressName, memo: newMemo });

      if (redirectedFromSend) {
        backAction();
      } else {
        history.push({
          pathname: router.addressBook,
          state: { snackbar: { show: true, message: SnackbarMessages.AddressAdded } }
        });
      }
    }
  });

  // todo refactor backAction props would be enough
  const handleCancel = () => {
    if (redirectedFromSend) {
      backAction();
    } else {
      history.push(router.addressBook);
    }
  };

  useEffect(() => {
    const errorsArray: string[] = objectValuesToArray(formik.errors);

    if (errorsArray[0]) {
      setIsSnackbarOpen(true);
      setSnackbarError(errorsArray[0]);
    }
  }, [formik.isSubmitting]);

  const removeAddress = (address: string): void => {
    keyring.forgetAddress(address);
    if (redirectedFromSend) {
      backAction();
    } else {
      history.push({
        pathname: router.addressBook,
        state: { snackbar: { show: true, message: SnackbarMessages.AddressRemoved } }
      });
    }
  };

  const back = () => {
    if (redirectedFromSend) {
      backAction();
    } else {
      history.push(router.addressBook);
    }
  };

  const walletLocation = () => {
    history.push(router.home);
    return { ...state.address };
  };

  return (
    <Container edit={editAddress}>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title={`${editAddress ? 'EDIT' : 'ADD'} ADDRESS`}
        onClose={closeAction || walletLocation}
        backAction={back}
      />
      <Content>
        <Form onSubmit={formik.handleSubmit}>
          <PlusIconContainer edit={editAddress}>
            {editAddress ? <EditBigIcon /> : <AddBigIcon />}
          </PlusIconContainer>
          <HumbleInput
            id={'name'}
            height="48px"
            marginTop="12px"
            placeholder="Name of Address"
            type="text"
            value={formik.values.name}
            error={formik.errors.name}
            onChange={formik.handleChange}
            bgColor="#303030"
            borderColor="#303030"
            color="#fff"
            placeholderColor="#B1B5C3"
          />
          <HumbleInput
            id={'address'}
            height="48px"
            marginTop="12px"
            type="text"
            placeholder="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.errors.address}
            bgColor="#303030"
            borderColor="#303030"
            color="#fff"
            placeholderColor="#B1B5C3"
          />
          {!editAddress && (
            <HumbleInput
              id={'memo'}
              height="48px"
              marginTop="12px"
              type="text"
              placeholder="Memo (optional)"
              value={formik.values.memo}
              onChange={formik.handleChange}
              bgColor="#303030"
              borderColor="#303030"
              color="#B1B5C3"
              placeholderColor="#B1B5C3"
            />
          )}

          <ButtonContainer>
            {!editAddress && (
              <Button
                onClick={handleCancel}
                text="Cancel"
                bgColor="#414141"
                borderColor="#414141"
                color="#fff"
                justify="center"
                margin="auto 10px 0 0"
              />
            )}
            <Button
              type="submit"
              text="Save"
              color="#111"
              borderColor="#fff"
              bgColor="#fff"
              justify="center"
              margin="auto 0 0 0"
              // bgImage="linear-gradient(to right,#1cc3ce,#b9e260);"
            />
          </ButtonContainer>
          {editAddress && (address || location?.state?.address) && (
            <Remove onClick={() => removeAddress(address || location?.state?.address?.address)}>
              {' '}
              Remove This Address
            </Remove>
          )}
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={snackbarError}
          type="error"
          left="8.5px"
          transform="translateX(0)"
          bottom={editAddress ? '86px' : '56px'}></Snackbar>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ redirectedFromSend?: boolean; edit?: boolean }>`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: ${({ edit }) => (edit ? '0 17.5px 33px' : '0 17.5px 44px')};
  box-sizing: border-box;
  background-color: ${({ redirectedFromSend }) => (redirectedFromSend ? '#fff' : '#18191A')};
  z-index: 99999;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 8.5px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PlusIconContainer = styled.div<{ redirectedFromSend?: boolean; edit?: boolean }>`
  width: 115px;
  height: 115px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000000;
  margin: ${({ edit }) => (edit ? '22.3px 0 20.7px' : '26px 0 17px')};
`;

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;

const Remove = styled.div`
  font-family: 'Inter';
  font-size: 13.4px;
  color: #fff;
  cursor: pointer;
  margin-top: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #fff;
`;
