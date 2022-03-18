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
import { useSelector } from 'react-redux';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import RequestToSign from 'pages/RequestToSign';
import backgroundImage from 'assets/imgs/sign-up-bg.png';
import mainLogoSvg from 'assets/imgs/main-logo-white.svg';

export default function WelcomeBack() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState<string | undefined>();
  const { pendingDappAuthorization, pendingToSign } = useSelector((state: any) => state.wallet);

  const pendingDapps = pendingDappAuthorization?.pendingDappAuthorization;

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

        if (pendingDapps?.length > 0) {
          goTo(RequestToConnect);
        } else if (pendingToSign.pending) {
          goTo(RequestToSign);
        } else {
          goTo(Wallet);
        }
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
    <PageContainer bgImage={backgroundImage}>
      <IconSection>
        <IconContainer img={mainLogoSvg}>{/* <DonutIcon /> */}</IconContainer>
      </IconSection>
      <MainSection>
        <Title>Welcome Back</Title>
        {/* <Description>HydroX — The Future of Banking</Description> */}
        <Form onSubmit={formik.handleSubmit}>
          <HumbleInput
            id="password"
            label="password"
            type="password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.errors.password}
            touched={formik.touched.password}
            color="#18191a"
            placeholderColor="#777e90"
            height="50px"
            borderColor={'#e6e8ec'}
            bgColor={'transparent'}
            // borderColor={formik?.errors?.password?.length ? '#fff' : '#e6e8ec'}
            // bgColor={formik?.errors?.password?.length ? '#fff' : 'transparent'}
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
          // message={snackbarError}
          message={'Incorrect Password'}
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          bottom="0px"
          left="0px"
          align="left"
        />
      </MainSection>
    </PageContainer>
  );
}

const IconSection = styled.div`
  width: 100%;
  height: 330px;
  position: relative;
`;

const IconContainer = styled.div<{ img: string }>`
  width: 279px;
  height: 279px;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center cen;
  position: absolute;
  left: -26px;
  top: -10px;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 16px;
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #18191a;
  font-family: 'IBM Plex Sans';
`;

const Text = styled.div`
  font-size: 12px;
  color: #777e90;
  font-family: 'IBM Plex Sans';
  margin-top: 38px;
`;
