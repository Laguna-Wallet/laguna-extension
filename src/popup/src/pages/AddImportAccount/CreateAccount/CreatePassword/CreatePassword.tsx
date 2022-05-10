import styled from 'styled-components';
import Button from 'components/primitives/Button';
import { useWizard } from 'react-use-wizard';
import { useFormik } from 'formik';
import { passwordStrength } from 'check-password-strength';
import { calculatePasswordCheckerColor, enhancePasswordStrength, isObjectEmpty } from 'utils';
import { createPasswordSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import { memo, useEffect, useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';
import HumbleInput from 'components/primitives/HumbleInput';
import { reduxForm, Field, getFormSyncErrors } from 'redux-form';
import { useSelector, connect } from 'react-redux';

const validate = (values: { password: string; confirmPassword: string }) => {
  const errors: { password?: string; confirmPassword?: string } = {};
  if (!values.password) {
    errors.password = 'Please fill out this field';
  } else if (values.password.length < 8) {
    errors.password = 'Password should be minimum 8 characters length';
  } else if (!values.confirmPassword) {
    errors.confirmPassword = 'Please fill out this field';
  } else if (values.confirmPassword.length < 8) {
    errors.confirmPassword = 'Password should be minimum 8 characters length';
  } else if (
    values.confirmPassword &&
    values.password &&
    values.confirmPassword !== values.password
  ) {
    errors.password = "Passwords don't match";
    errors.confirmPassword = "Passwords don't match";
  }

  return errors;
};

type Props = {
  handleSubmit: any;
  errors?: Record<string, string>;
};

function CreatePassword({ handleSubmit, errors }: Props) {
  const { nextStep } = useWizard();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('Please fix the existing errors');

  const formValues = useSelector((state: any) => state?.form?.CreatePassword?.values);

  const account = useAccount();

  const passwordLength = enhancePasswordStrength(passwordStrength(formValues?.password).value);

  const submit = (values: Record<string, string>) => {
    account.setPassword(values.password);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(submit)}>
        <MainContent>
          <Title>Create a Password</Title>
          <Description>Please create a secure password to unlock your HydroX wallet:</Description>
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
              // error: errors && errors['password'],
              showError: true,
              hideErrorMsg: false,
              autoFocus: true
            }}
          />

          <PasswordStrength>
            Password strength:{' '}
            <LengthIndicator color={calculatePasswordCheckerColor(passwordLength)}>
              {passwordLength}
            </LengthIndicator>
          </PasswordStrength>

          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Password"
            component={HumbleInput}
            props={{
              type: 'password',
              marginTop: '16px',
              height: '48.7px',
              borderColor: '#e6e8ec',
              fontSize: '14px',
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              error: errors && errors['confirmPassword'],
              errorColor: '#FB5A5A',
              errorBorderColor: '#FB5A5A',
              showError: true,
              hideErrorMsg: false
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
          // onClick={handleSubmit}
          Icon={<RightArrow width={23} />}
          text={'Create Password'}
          margin="auto 0px 0px 0px"
          justify="center"
          disabled={
            !(formValues?.confirmPassword && formValues?.password) && !isObjectEmpty(errors || {})
          }
        />
      </Form>
    </Container>
  );
}

// debouncePromise(async (value) => {
//   return await validatePhoneNumber(value) || 'Phone number is invalid';
// }, 500),

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
  padding: 30px 16px 38px 16px;
  box-sizing: border-box;
`;

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 22px;
  font-weight: 500;
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
