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

type AddAddressFormikValues = {
  addressName: string;
  address: string;
  memo: string;
};

type Props = {
  addressName?: string;
  address?: string;
  memo?: string;
  edit?: boolean;
  redirectedFromSend: boolean;
  BackComponent: any;
};

export default function AddAddress({
  addressName,
  address,
  memo,
  edit,
  BackComponent,
  redirectedFromSend
}: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const formik = useFormik<AddAddressFormikValues>({
    initialValues: {
      addressName: addressName || '',
      address: address || '',
      memo: memo || ''
    },

    validationSchema: addAddressSchema,
    onSubmit: ({ address: newAddress, addressName: newAddressName, memo: newMemo }) => {
      if (edit && address) {
        keyring.forgetAddress(address);
      }

      keyring.saveAddress(newAddress, { addressName: newAddressName, memo: newMemo });
      goTo(AddressBook);
    }
  });

  useEffect(() => {
    const errorsArray: string[] = objectValuesToArray(formik.errors);

    if (errorsArray[0]) {
      setIsSnackbarOpen(true);
      setSnackbarError(errorsArray[0]);
    }
  }, [formik.isSubmitting]);

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        onClose={() => goTo(BackComponent || Wallet)}
        title="Add Address"
      />
      <Content>
        <Form onSubmit={formik.handleSubmit}>
          <PlusIconContainer>
            <PlusIcon width={46} stroke="#999999" />
          </PlusIconContainer>
          {/* addressName address memo */}
          <HumbleInput
            id={'addressName'}
            height="48px"
            marginTop="12px"
            placeholder="Name of Address"
            type="text"
            value={formik.values.addressName}
            error={formik.errors.addressName}
            onChange={formik.handleChange}
            bgColor="#303030"
            color="#adadad"
            borderColor="#303030"
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
            color="#adadad"
            borderColor="#303030"
          />
          <HumbleInput
            id={'memo'}
            height="48px"
            marginTop="12px"
            type="text"
            placeholder="Memo (optional)"
            value={formik.values.memo}
            onChange={formik.handleChange}
            bgColor="#303030"
            color="#adadad"
            borderColor="#303030"
          />

          <ButtonContainer>
            <Button
              text="Cancel"
              bgColor="#fff"
              color="#111"
              justify="center"
              margin="auto 10px 0 0"
            />
            <Button
              type="submit"
              text="Save"
              color="#111"
              justify="center"
              margin="auto 0 0 0"
              bgImage="linear-gradient(to right,#1cc3ce,#b9e260);"
            />
          </ButtonContainer>
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="0px"
          bottom="52px">
          <CloseIconContainer>
            <CloseIcon stroke="#111" />
          </CloseIconContainer>
          <ErrorMessage>{snackbarError}</ErrorMessage>
        </Snackbar>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ redirectedFromSend?: boolean }>`
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 15px 15px 40px 15px;
  box-sizing: border-box;
  background-color: ${({ redirectedFromSend }) => (redirectedFromSend ? '#fff' : '#111111')};
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
  background-color: #000;
  margin-top: auto;
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

const ErrorMessage = styled.div`
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  margin-left: 5px;
`;

const CloseIconContainer = styled.div`
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
