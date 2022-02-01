import styled from 'styled-components';
import ArrowSmRightIcon from '@heroicons/react/outline/ArrowSmRightIcon';
import Button from 'components/primitives/Button';
import Input from 'components/primitives/Input';
import { useWizard } from 'react-use-wizard';
import { useFormik } from 'formik';
import { passwordStrength } from 'check-password-strength';
import { calculatePasswordCheckerColor } from 'utils';
import { createPasswordSchema } from 'utils/validations';
import Snackbar from 'components/Snackbar/Snackbar';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import { useAccount } from 'context/AccountContext';
import { memo, ReactEventHandler, useEffect, useState } from 'react';
import RightArrow from 'assets/svgComponents/RightArrow';

function CreatePassword() {
  const { nextStep } = useWizard();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const account = useAccount();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: createPasswordSchema,
    onSubmit: (values) => {
      account.setPassword(values.password);
      nextStep();
    }
  });

  const passwordLength = passwordStrength(formik.values.password).value;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    formik.handleSubmit();

    if (!formik.isValid) {
      setIsSnackbarOpen(true);
    }
  };
  
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <MainContent>
          <Title>CREATE PASSWORD</Title>
          <Description>Please create a secure password to unlock your HydroX wallet:</Description>
          <Input
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            type="password"
            placeholder="password"
            label="New password"
            error={formik.errors['password']}
            touched={formik.touched['password']}
            marginTop="24px"
            height="60px"
            autoFocus={true}
          />
          <PasswordStrength>
            Password strength:{' '}
            <LengthIndicator color={calculatePasswordCheckerColor(passwordLength)}>
              {passwordLength}
            </LengthIndicator>
          </PasswordStrength>

          <Input
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            type="password"
            placeholder="password"
            label="Confirm password"
            error={formik.errors['confirmPassword']}
            touched={formik.touched['confirmPassword']}
            marginTop="16px"
            height="60px"
          />
        </MainContent>
        <Snackbar
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          bottom="50px">
          <CloseIconContainer>
            <CloseIcon stroke="#111" />
          </CloseIconContainer>
          <ErrorMessage>Please fix the existing errors</ErrorMessage>
        </Snackbar>
        <Button type="submit" Icon={<RightArrow width={23} />} text={'Create Password'} />
      </Form>
    </Container>
  );
}

export default memo(CreatePassword);

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-top: 24px;
  position: relative;
`;

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.span`
  font-size: 17px;
  font-family: 'Sequel100Wide55Wide';
  letter-spacing: 0.85px;
  color: #000000;
`;

const Description = styled.span`
  margin-top: 16px;
  font-family: 'SFCompactDisplayRegular';
  font-size: 16px;
  color: #767e93;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
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
