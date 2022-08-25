import styled from 'styled-components';
import Button from 'components/primitives/Button';
import { useWizard } from 'react-use-wizard';
import { passwordStrength } from 'check-password-strength';
import { calculatePasswordCheckerColor, isObjectEmpty } from 'utils';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import { useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';
import HumbleInput from 'components/primitives/HumbleInput';
import { reduxForm, Field, getFormSyncErrors, InjectedFormProps } from 'redux-form';
import { useSelector, connect } from 'react-redux';
import WizardHeader from 'pages/AddImportAccount/WizardHeader';
import { checkPasswordStrength } from 'utils/checkPasswordStrength';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

const validate = (values: { password: string; confirmPassword: string }) => {
  const errors: { password?: string; confirmPassword?: string } = {};
  if (!values.password) {
    errors.password = 'Please fill out this field';
  } else if (values?.password?.length < 8) {
    errors.password = 'Must be at least 8 characters';
  } else if (!values.confirmPassword) {
    errors.confirmPassword = 'Please fill out this field';
  } else if (values?.confirmPassword?.length < 8) {
    errors.confirmPassword = 'Must be at least 8 characters';
  } else if (
    values.confirmPassword &&
    values.password &&
    values.confirmPassword !== values.password
  ) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

type Props = {
  errors?: Record<string, string>;
  redirectedFromSignUp?: boolean;
  redirectedFromForgotPassword?: boolean;
  handleEncode?: (password: string) => void;
};

function CreatePassword({
  handleSubmit,
  errors,
  handleEncode,
  redirectedFromSignUp,
  redirectedFromForgotPassword
}: InjectedFormProps & Props) {
  const account = useAccount();
  const history = useHistory();

  const { previousStep } = useWizard();
  const formValues = useSelector((state: any) => state?.form?.CreatePassword?.values);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const passwordLength = passwordStrength(formValues?.password, checkPasswordStrength).value;

  const submit = async (values: Record<string, string>) => {
    if (isObjectEmpty(errors || {})) {
      account.setPassword(values.password);

      if (redirectedFromForgotPassword && handleEncode) {
        await handleEncode(formValues?.password);
      }

      // next step is not needed here because, whe the user saves password in the storage
      // from stepper CreatePassword is removed therefore the next page is rendered
      // nextStep();
    } else {
      setSnackbarMessage('Please fix the existing errors');
      setIsSnackbarOpen(true);
    }
  };

  return (
    <Container>
      {!redirectedFromForgotPassword && (
        <WizardHeader
          onClose={() => {
            if (redirectedFromSignUp) {
              history.push(router.signUp);
            } else {
              history.push(router.welcomeBack);
            }
          }}
          onBack={() => {
            previousStep();
          }}
        />
      )}
      <Form
        redirectedFromForgotPassword={redirectedFromForgotPassword}
        onSubmit={handleSubmit(submit)}>
        <MainContent>
          <Title>Create a Password</Title>
          <Description>
            This password will unlock your wallet and encrypt all your accounts:
          </Description>
          <Field
            id="password"
            name="password"
            type="password"
            label="New password"
            placeholder="Password"
            component={HumbleInput}
            props={{
              type: 'password',
              marginTop: '24px',
              height: '48.7px',
              borderColor: '#e6e8ec',
              fontSize: '14px',
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              errorColor: '#FB5A5A',
              errorBorderColor: '#FB5A5A',
              showError: true,
              autoFocus: true
            }}
          />

          {formValues?.password?.length && (
            <PasswordStrength>
              Password strength:
              <LengthIndicator color={calculatePasswordCheckerColor(passwordLength)}>
                {passwordLength}
              </LengthIndicator>
            </PasswordStrength>
          )}

          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Confirm new password"
            component={HumbleInput}
            props={{
              type: 'password',
              marginTop: formValues?.password?.length ? '12px' : '32px',
              marginBottom: errors && errors['confirmPassword'] ? '0' : '18px',
              height: '48.7px',
              borderColor: '#e6e8ec',
              fontSize: '14px',
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              errorColor: '#FB5A5A',
              errorBorderColor: '#FB5A5A',
              showError: true
            }}
          />
        </MainContent>
        <Snackbar
          width="90%"
          isOpen={isSnackbarOpen}
          message={snackbarMessage}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          bottom="90px"
          align="left"
        />
        <Button
          type="submit"
          Icon={<RightArrow width={23} />}
          text={'Create Password'}
          margin="auto 0px 0px 0px"
          justify="center"
          disabled={!isObjectEmpty(errors || {})}
        />
      </Form>
    </Container>
  );
}

export default connect((state: any) => ({
  errors: getFormSyncErrors('CreatePassword')(state)
}))(
  reduxForm<Record<string, unknown>, Record<string, unknown>>({
    form: 'CreatePassword',
    validate
  })(CreatePassword)
);

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
  padding: 30px 26px 29px;
  box-sizing: border-box;
`;

const Form = styled.form<{ redirectedFromForgotPassword?: boolean }>`
  width: 100%;
  height: ${({ redirectedFromForgotPassword }) =>
    redirectedFromForgotPassword ? '100%' : 'calc(100% - 24px)'};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 600;
  line-height: 1.82;
  text-align: left;
  color: #18191a;
`;

const Description = styled.span`
  margin-top: 12px;
  font-family: Inter;
  font-size: 16px;
  line-height: 1.45;
  color: #353945;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const PasswordStrength = styled.div`
  font-size: 12px;
  color: #a4a9b7;
  padding-left: 16px;
  margin-top: 4px;
  display: flex;
`;

const LengthIndicator = styled.div<{ color: string }>`
  margin-left: 3px;
  color: ${({ color }) => color};
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
