import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { FormikProps, useFormik } from 'formik';
import { goTo } from 'react-chrome-extension-router';

import MenuHeader from 'components/MenuHeader/MenuHeader';
import Wallet from 'pages/Wallet/Wallet';

import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';

import { PlusIcon } from '@heroicons/react/outline';
import { addAddressSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import { objectValuesToArray } from 'utils';
import keyring from '@polkadot/ui-keyring';
import AddressBook from './AddressBook';
import AddressPencilIcon from 'assets/svgComponents/PencilIcon';
import { addressExists, isValidPolkadotAddress } from 'utils/polkadot';
import { SnackbarMessages } from 'utils/types';
import EditAddressIcon from 'assets/svgComponents/EditAddressIcon';

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
  closeAction: () => void;
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
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const formik = useFormik<AddAddressFormikValues>({
    initialValues: {
      name: name || '',
      address: address || '',
      memo: memo || ''
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

      if (!edit && addressExists(newAddress)) {
        setIsSnackbarOpen(true);
        setSnackbarError('Address already exists');
        return;
      }

      if (edit && address) {
        keyring.forgetAddress(address);
      }

      keyring.saveAddress(newAddress, { name: newAddressName, memo: newMemo });

      if (redirectedFromSend) {
        backAction();
      } else {
        goTo(AddressBook, { snackbar: { show: true, message: SnackbarMessages.AddressAdded } });
      }
    }
  });

  // todo refactor backAction props would be enough
  const handleCancel = () => {
    if (redirectedFromSend) {
      backAction();
    } else {
      goTo(AddressBook);
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
      goTo(AddressBook, { snackbar: { show: true, message: SnackbarMessages.AddressRemoved } });
    }
  };

  const back = () => {
    if (redirectedFromSend) {
      backAction();
    } else {
      goTo(AddressBook);
    }
  };

  return (
    <Container edit={edit}>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title={`${edit ? 'EDIT' : 'ADD'} ADDRESS`}
        onClose={closeAction}
        backAction={back}
      />
      <Content>
        <Form onSubmit={formik.handleSubmit}>
          <PlusIconContainer>
            {edit ? (
              <EditAddressIcon width={40} height={40} fill="#fff" />
            ) : (
              <PlusIcon width={46} stroke="#fff" />
            )}
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
            color="#B1B5C3"
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
            color="#B1B5C3"
            placeholderColor="#B1B5C3"
          />
          {!edit && (
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
            {!edit && (
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
          {edit && address && (
            <Remove onClick={() => removeAddress(address)}> Remove This Address</Remove>
          )}
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={snackbarError}
          type="error"
          left="0px"
          bottom="52px"></Snackbar>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ redirectedFromSend?: boolean; edit?: boolean }>`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: ${({ edit }) => (edit ? '15px 26px 15px 26px' : '15px 26px 40px 26px')};
  box-sizing: border-box;
  background-color: ${({ redirectedFromSend }) => (redirectedFromSend ? '#fff' : '#18191A')};
  z-index: 99999;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PlusIconContainer = styled.div`
  width: 129px;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000000;
  margin-top: 22.3px;
  margin-bottom: 20.7px;
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
  font-family: 'SFCompactDisplayRegular';
  font-size: 13.4px;
  color: #fff;
  cursor: pointer;
  margin-top: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid #fff;
`;
