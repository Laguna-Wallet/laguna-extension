import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

import MenuHeader from 'components/MenuHeader/MenuHeader';

import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';

import { PlusIcon } from '@heroicons/react/outline';
import { addAddressSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import { objectValuesToArray } from 'utils';
import keyring from '@polkadot/ui-keyring';

type AddAddressFormikValues = {
  name: string;
  address: string;
  memo: string;
};

export default function AddAddress() {
  const history = useHistory();

  const [isOpen, setOpen] = useState<boolean>(true);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const formik = useFormik<AddAddressFormikValues>({
    initialValues: {
      name: '',
      address: '',
      memo: ''
    },
    validationSchema: addAddressSchema,
    onSubmit: ({ address, name, memo }) => {
      keyring.saveAddress(address, { name, memo });
      history.push(router.addressBook);
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
        onClose={() => history.push(router.home)}
        title="Add Address"
      />
      <Content>
        <Form onSubmit={formik.handleSubmit}>
          <PlusIconContainer>
            <PlusIcon width={46} stroke="#999999" />
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
            color="#fff"
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
            color="#fff"
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
            color="#fff"
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

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0 17.5px 44px;
  box-sizing: border-box;
  background-color: #111111;
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
