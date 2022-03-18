import styled from 'styled-components';
import Button from 'components/primitives/Button';
import { useWizard } from 'react-use-wizard';
import { useFormik } from 'formik';
import { passwordStrength } from 'check-password-strength';
import { calculatePasswordCheckerColor } from 'utils';
import { createPasswordSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import { memo, useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';
import HumbleInput from 'components/primitives/HumbleInput';

function CreatePassword() {
  const { nextStep } = useWizard();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const account = useAccount();
  // todo refactor, change formik to redux-form
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: createPasswordSchema,
    onSubmit: (values) => {
      // after password is set and wizard component is rerendered
      // it removes CreatePassword from dom and sets next element
      // so no need calling nextStep()
      // {!encoded && <CreatePassword />}
      account.setPassword(values.password);
    }
  });

  const passwordLength = passwordStrength(formik.values.password).value;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!formik.isValid) {
      setIsSnackbarOpen(true);
      return;
    }

    formik.handleSubmit();
  };

  return (
    <Container>
      <Form>
        <MainContent>
          <Title>Create Password</Title>
          <Description>Please create a secure password to unlock your HydroX wallet:</Description>
          <HumbleInput
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            placeholder="Password"
            label="New password"
            error={formik.errors['password']}
            touched={formik.touched['password']}
            marginTop="24px"
            height="48.7px"
            autoFocus={true}
            borderColor="#e6e8ec"
            fontSize="14px"
            color="#b1b5c3"
            placeholderColor="#b1b5c3"
          />
          <PasswordStrength>
            Password strength:{' '}
            <LengthIndicator color={calculatePasswordCheckerColor(passwordLength)}>
              {passwordLength}
            </LengthIndicator>
          </PasswordStrength>

          <HumbleInput
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            type="password"
            placeholder="Password"
            label="Confirm password"
            error={formik.errors['confirmPassword']}
            touched={formik.touched['confirmPassword']}
            height="48.7px"
            marginTop="16px"
            fontSize="14px"
            color="#b1b5c3"
            placeholderColor="#b1b5c3"
          />
        </MainContent>
        <Snackbar
          width="80%"
          isOpen={isSnackbarOpen}
          message="Please fix the existing errors"
          close={() => setIsSnackbarOpen(false)}
          type="warning"
          bottom="90px"
        />

        <Button
          type="button"
          onClick={handleSubmit}
          Icon={<RightArrow width={23} />}
          text={'Create Password'}
          margin="auto 0px 0px 0px"
          justify="center"
        />
      </Form>
    </Container>
  );
}

export default memo(CreatePassword);

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
