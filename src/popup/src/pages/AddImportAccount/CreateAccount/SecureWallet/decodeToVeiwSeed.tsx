import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import Snackbar from 'components/Snackbar/Snackbar';
import { useState } from 'react';
import styled from 'styled-components';
import { validatePassword } from 'utils/polkadot';
import encodeBg from 'assets/imgs/encode-bg.png';
import { useWizard } from 'react-use-wizard';
import { useAccount } from 'context/AccountContext';
import * as AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { validPassword } from 'utils';

type Form = {
  password: string;
};

const DecodeToViewSeed = ({ handleSubmit, valid }: InjectedFormProps<Form>) => {
  const { nextStep } = useWizard();
  const account = useAccount();

  const [snackbarError, setSnackbarError] = useState<string>('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const submit = async (values: Form) => {
    const { password } = values;
    const isValid = await validatePassword(password);

    if (!isValid) {
      setIsSnackbarOpen(true);
      setSnackbarError('Incorrect Password');
      return;
    }

    try {
      const decodedSeed = AES.decrypt(
        account.getActiveAccount()?.meta?.encodedSeed as string,
        password
      );

      const seed = decodedSeed.toString(Utf8).split(' ');

      account.setMnemonics(seed);

      nextStep();
    } catch (err: any) {
      // todo proper typing
      setIsSnackbarOpen(true);
      setSnackbarError(err.message);
    }
  };

  return (
    <Container bg={encodeBg}>
      <Content>
        <Description>To proceed with backing up, please enter your password:</Description>
        <Form onSubmit={handleSubmit(submit)}>
          {/* todo proper event typing */}
          <Field
            id="password"
            name="password"
            type="password"
            // label="password"
            placeholder="Your password"
            component={HumbleInput}
            props={{
              type: 'password',
              height: '48px',
              fontSize: '16px',
              bgColor: '#ececec',
              color: '#434343',
              placeholderColor: '#000',
              errorBorderColor: '#fb5a5a',
              autoFocus: true
            }}
          />
          <Button
            type="submit"
            margin="10px 0 0 0"
            text={'Next'}
            justify="center"
            styledDisabled={!valid}
          />
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="26px"
          bottom={'148px'}
          transform="translateX(0)"
        />
      </Content>
    </Container>
  );
};

export default reduxForm<Record<string, unknown>, any>({
  form: 'DecodeToViewSeed',
  validate: validPassword
})(DecodeToViewSeed);

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 26px 38px;
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
`;

const Description = styled.div`
  height: 38px;
  font-family: Inter;
  font-size: 14px;
  text-align: left;
  color: #353945;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: auto;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* margin-top: auto; */
`;
