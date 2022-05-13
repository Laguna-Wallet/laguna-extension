import CheckMarkIcon from 'assets/svgComponents/CheckMarkIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import Wallet from 'pages/Wallet/Wallet';
import { useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { validatePassword } from 'utils/polkadot';
import encodeBg from 'assets/imgs/encode-bg.png';
import { useWizard } from 'react-use-wizard';
import { State } from 'redux/store';
import { reduxForm,  Field, InjectedFormProps } from 'redux-form';
import { isObjectEmpty, objectToArray, validPassword } from 'utils';

type Props = {
  handleEncode: (password: string) => void;
  title: string;
};

type FormProps  = { 
  password: string;
}

function EncodeAccount({ handleEncode, handleSubmit, title, pristine, submitting  }: InjectedFormProps<FormProps> & Props) {
  const { nextStep, handleStep } = useWizard();

  const [snackbarError, setSnackbarError] = useState<string>('');
  const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const hasBoarded = useSelector((state: State) => state?.wallet?.onboarding);

  handleStep(() => {
    return;
  });

  const submit = async (values: FormProps) => {
    const {password} = values;
    const errors = validPassword(password);

    if (!isObjectEmpty(errors)) {
      const errArray = objectToArray(errors);

      setSnackbarError(errArray[0]);
      setIsSnackbarOpen(true);
      return;
    }

    const isValid = await validatePassword(password);

    if (isValid){
      await handleEncode(password);
  
      if (hasBoarded) {
        goTo(Wallet);
      } else {
        nextStep();
      }
    }else {
      setIsSnackbarOpen(true);
      setSnackbarError('Invalid Password');
      setIsChangeValue(true);
      return;
    } 
  };

  return (
    <Container bg={encodeBg}>
      <Content>
        <IconContainer>
          <CheckMarkIcon fill="#111" />
        </IconContainer>
        <Title>{title}</Title>
        <Description>To encrypt your new wallet please enter your password below:</Description>
        <Form
          onSubmit={handleSubmit(submit)}>
          <Field
            id="password"
            name="password"
            type="password"
            label="password"
            placeholder="Enter Password for this file"
            component={HumbleInput}
            props={{
              type: 'password',
              height: '45px',
              fontSize: '14px',
              marginTop: '20px',
              textAlign: 'center',
              bgColor: '#f2f2f2',
              color: '#b1b5c3',
              placeholderColor: '#b1b5c3',
              hideErrorMsg: false,
              autoFocus: true,
              isChangeValue,
              setIsChangeValue,
              errorBorderColor: '#fb5a5a',
            }}
          />
          <Button
            type="submit"
            margin="10px 0 0 0"
            text={'Finish'}
            justify="center"
            disabled={pristine || submitting}
          />
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="26px"
          bottom={'145px'}
          transform='translateX(0)'
          />
      </Content>
    </Container>
  );
}

export default reduxForm<Record<string, unknown>, any>({
  form: 'EncodeAccount',
  destroyOnUnmount: false
})(EncodeAccount);

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 26px 29px;
  box-sizing: border-box;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  width: 167.3px;
  height: 167.3px;
  border-radius: 100%;
  background-color: #fff;
  box-shadow: 5px 5px 50px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-top: auto;
`;

const Circle = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(265.71deg, #1cc3ce -32.28%, #b9e260 104.04%);
  border-radius: 100%;
`;

const CircleInner = styled.div`
  width: 94%;
  height: 94%;
  background-color: #f8f8f8;
  border-radius: 100%;
`;

const CheckMarkContainer = styled.div`
  position: absolute;
  top: -15px;
  right: -20px;
`;

const LockContainer = styled.div`
  position: absolute;
  top: 70px;
`;

const Title = styled.div`
  font-size: 22px;
  margin-top: 28px;
  font-family: 'IBM Plex Sans';
  font-weight: 500;
  text-align: center;
  color: #18191a;
`;

const Description = styled.div`
  width: 251px;
  height: 38px;
  margin-top: 10px;
  font-family: Inter;
  font-size: 14px;
  text-align: center;
  color: #353945;
  margin-bottom: 40px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;
