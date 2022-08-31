import Button from "components/primitives/Button";
import Input from "components/primitives/Input";
import { PageContainer } from "components/ui";
import { useFormik } from "formik";
import styled from "styled-components";
import { exportJson } from "utils";
import { exportAll } from "utils/polkadot";
import { exportAllSchema } from "utils/validations";
import { useHistory, Link } from "react-router-dom";
import { router } from "router/router";

export default function ExportAllAccounts() {
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: exportAllSchema,
    onSubmit: async (values) => {
      const json = await exportAll(values.password);
      await exportJson(json);
      history.push(router.home);
    },
  });

  return (
    <PageContainer>
      <MainContent>
        <Title>PASSWORD FOR ENCRYPTING ALL ACCOUNTS</Title>
        <Form onSubmit={formik.handleSubmit}>
          <Input
            id={"password"}
            value={formik.values["password"]}
            onChange={formik.handleChange}
            type="text"
            height="50px"
            borderColor="#cccccd"
            error={formik.errors["password"]}
            touched={formik.touched["password"]}
            autoFocus={true}
          />
          <Button type="submit" text="Export All Accounts" justify="center" />
        </Form>
        <Link to={router.home}>
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
