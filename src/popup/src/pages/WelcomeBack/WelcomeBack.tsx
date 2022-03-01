import Button from 'components/primitives/Button';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
import { goTo, Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';
import { useFormik } from 'formik';
import Input from 'components/primitives/Input';
import { welcomeBackSchema } from 'utils/validations';
// import { validatePassword } from 'utils/polkadot';
import Wallet from 'pages/Wallet/Wallet';
import { clearFromStorage, saveToStorage } from 'utils/chrome';
import { Messages, StorageKeys } from 'utils/types';
import { useEffect, useState } from 'react';
import Snackbar from 'components/Snackbar/Snackbar';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import { validatePassword } from 'utils/polkadot';

export default function WelcomeBack() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState<string | undefined>();

  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: welcomeBackSchema,
    onSubmit: ({ password }) => {
      const isValid = validatePassword(password);
      if (isValid) {
        saveToStorage({ key: StorageKeys.SignedIn, value: 'true' });
        clearFromStorage(StorageKeys.LoggedOut);
        chrome.runtime.sendMessage({ type: Messages.AuthUser, payload: { password } });
        goTo(Wallet);
      } else {
        setSnackbarError('Incorrect Password');
        setIsSnackbarOpen(true);
      }
    }
  });

  useEffect(() => {
    if (formik.errors.password) {
      setIsSnackbarOpen(false);
      setSnackbarError(formik.errors.password);
      setIsSnackbarOpen(true);
    }
  }, [formik.submitCount]);

  return (
    <PageContainer>
      <Logo />
      <MainSection>
        <Title>Welcome Back, Skywalker</Title>
        <Description>HydroX — The Future of Banking</Description>
        <Form onSubmit={formik.handleSubmit}>
          <HumbleInput
            id="password"
            label="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.errors.password}
            touched={formik.touched.password}
            height="50px"
            borderColor={formik?.errors?.password?.length ? '#fff' : '#e4e4e4'}
            bgColor={formik?.errors?.password?.length ? '#fff' : '#e4e4e4'}
            autoFocus={true}
          />

          <Button
            type="submit"
            text="Unlock"
            bgColor="#111"
            color="#fff"
            borderColor="#111"
            margin="12px 0 0 0"
            justify="center"
          />
        </Form>
        <Text>Contact Support</Text>
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          bottom="-20px">
          <CloseIconContainer onClick={() => setIsSnackbarOpen(false)}>
            <CloseIcon stroke="#111" />
          </CloseIconContainer>
          <ErrorMessage>{snackbarError}</ErrorMessage>
        </Snackbar>
      </MainSection>
    </PageContainer>
  );
}

const Logo = styled.div`
  width: 100%;
  height: 330px;
`;

const StyledLink = styled(Link)`
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 20px;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-family: 'Sequel100Wide55Wide';
`;

const Description = styled.div`
  color: #808080;
  font-size: 14px;
  font-weight: 400;
  font-family: 'SFCompactDisplayRegular';
  margin-top: 5px;
`;

const Text = styled.div`
  font-size: 12px;
  color: #808080;
  font-family: 'SFCompactDisplayRegular';
  margin-top: 24px;
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
