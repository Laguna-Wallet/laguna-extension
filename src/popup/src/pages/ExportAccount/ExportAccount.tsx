import Button from 'components/primitives/Button';
import Input from 'components/primitives/Input';
import { PageContainer } from 'components/ui';
import { useFormik } from 'formik';
import Wallet from 'pages/Wallet/Wallet';
import { Link, goTo } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { exportJson } from 'utils';
import { exportAccount } from 'utils/polkadot';
import { exportAccountSchema } from 'utils/validations';

type Props = {
  address: string;
};

export default function ExportAccount({ address }: Props) {
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: exportAccountSchema,
    onSubmit: async (values) => {
      try {
        const json = await exportAccount(address, values.password);
        await exportJson(json);
        goTo(Wallet);
      } catch (err) {
        // todo add snackbar
        console.log(err);
      }
    }
  });

  return (
    <PageContainer>
      <MainContent>
        <Title>You are exporting your account. Keep it safe and dont share it with anyone.</Title>
        <Form onSubmit={formik.handleSubmit}>
          <Input
            id={'password'}
            value={formik.values['password']}
            onChange={formik.handleChange}
            type="password"
            height="50px"
            borderColor="#cccccd"
            error={formik.errors['password']}
            touched={formik.touched['password']}
            label="PASSWORD FOR THIS ACCOUNT"
            autoFocus={true}
          />
          <Button type="submit" text="Export Account" justify="center" />
        </Form>

        <Link component={Wallet}>
          <CancelBtn>Cancel</CancelBtn>
        </Link>
      </MainContent>
    </PageContainer>
  );
}

const MainContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const CancelBtn = styled.div`
  margin-top: 10px;
  cursor: pointer;
  color: #8f8f8f;
`;

const Form = styled.form`
  width: 100%;
  margin-top: 10px;
`;
