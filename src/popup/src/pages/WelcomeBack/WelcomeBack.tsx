import Button from 'components/primitives/Button';
import { goTo } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { PageContainer } from 'components/ui';
import Wallet from 'pages/Wallet/Wallet';
import { Messages } from 'utils/types';
import { useState } from 'react';
import Snackbar from 'components/Snackbar/Snackbar';
import HumbleInput from 'components/primitives/HumbleInput';
import { validatePassword } from 'utils/polkadot';
import { useSelector } from 'react-redux';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import ImportAccount from 'pages/AddImportAccount/ImportAccount/ImportAccount';
import RequestToSign from 'pages/RequestToSignTransaction';
import backgroundImage from 'assets/imgs/sign-up-bg.png';
import mainLogoSvg from 'assets/imgs/main-logo-white.svg';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';
import { isObjectEmpty, objectToArray, validPassword } from 'utils';

type Props = {
  password: string;
};

function WelcomeBack({ handleSubmit, pristine, submitting }: InjectedFormProps<Props>) {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState<string | undefined>();
  const { pendingDappAuthorization, pendingToSign } = useSelector((state: any) => state.wallet);

  const pendingDapps = pendingDappAuthorization?.pendingDappAuthorization;

  const submit = async (values: Props) => {
    const { password } = values;
    const errors = validPassword(password);

    if (isObjectEmpty(errors)) {
      const isValid = await validatePassword(password);

      if (isValid) {
        chrome.runtime.sendMessage({
          type: Messages.AuthUser,
          payload: { password }
        });

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
  };

  return (
    <PageContainer bgImage={backgroundImage}>
      <IconSection>
        <IconContainer img={mainLogoSvg}></IconContainer>
      </IconSection>
      <MainSection>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit(submit)}>
          <Field
            id="password"
            name="password"
            type="password"
            label="password"
            placeholder="Enter your password"
            component={HumbleInput}
            props={{
              type: 'password',
              color: '#18191a',
              placeholderColor: '#777e90',
              height: '50px',
              marginTop: '12px',
              borderColor: '#e6e8ec',
              errorBorderColor: '#fb5a5a',
              bgColor: 'transparent',
              autoFocus: true
            }}
          />
          <Button
            type="submit"
            text="Unlock"
            bgColor="#111"
            color="#fff"
            borderColor="#111"
            margin="12px 0 0 0"
            justify="center"
            styledDisabled={pristine || submitting}
          />
        </Form>
        <BottomContainer>
          <Text>Contact Support</Text>
          <Text onClick={() => goTo(ImportAccount, { redirectedFromForgotPassword: true })}>
            Forgot your password?
          </Text>
        </BottomContainer>

        <Snackbar
          message={snackbarError}
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          bottom="0px"
          left="50%"
          align="left"
        />
      </MainSection>
    </PageContainer>
  );
}

export default reduxForm<Record<string, unknown>, any>({
  form: 'welcomeBack'
})(WelcomeBack);

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

const BottomContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const Text = styled.div`
  font-size: 12px;
  color: #777e90;
  font-family: 'IBM Plex Sans';
  margin-top: 38px;
  cursor: pointer;
`;
