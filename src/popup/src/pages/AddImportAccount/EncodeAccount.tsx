import CheckMarkIcon from "assets/svgComponents/CheckMarkIcon";
import Button from "components/primitives/Button";
import HumbleInput from "components/primitives/HumbleInput";
import Snackbar from "components/Snackbar/Snackbar";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { validatePassword } from "utils/polkadot";
import encodeBg from "assets/imgs/encode-bg.png";
import { useWizard } from "react-use-wizard";
import { State } from "redux/store";
import { reduxForm, Field, InjectedFormProps } from "redux-form";
import { isObjectEmpty, validPassword } from "utils";
import { useHistory } from "react-router-dom";
import { router } from "router/router";

type Props = {
  handleEncode: (password: string) => void;
  title: string;
  descriptionText: string;
};

type Form = {
  password: string;
};

function EncodeAccount({
  handleEncode,
  handleSubmit,
  title,
  valid,
  descriptionText,
}: InjectedFormProps<Form> & Props) {
  const { nextStep } = useWizard();
  const history = useHistory();

  const [snackbarError, setSnackbarError] = useState<string>("");
  const [isChangeValue, setIsChangeValue] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const hasBoarded = useSelector((state: State) => state?.wallet?.onboarding);

  const submit = async (values: Form) => {
    const errors = validPassword(values);

    if (isObjectEmpty(errors)) {
      const isValid = await validatePassword(values?.password);

      if (isValid) {
        handleEncode(values?.password);

        if (hasBoarded) {
          history.push(router.home);
        } else {
          nextStep();
        }
      } else {
        setIsSnackbarOpen(true);
        setSnackbarError("Incorrect Password");
        setIsChangeValue(true);
        return;
      }
    }
  };

  return (
    <Container bg={encodeBg}>
      <Content>
        <IconContainer>
          <CheckMarkIcon fill="#111" />
        </IconContainer>
        <Title>{title}</Title>
        <Description>{descriptionText}</Description>
        <Form onSubmit={handleSubmit(submit)}>
          <Field
            id="password"
            name="password"
            type="password"
            label="password"
            placeholder="Enter your password"
            component={HumbleInput}
            props={{
              type: "password",
              height: "48px",
              fontSize: "16px",
              marginTop: "20px",
              textAlign: "center",
              bgColor: "#f2f2f2",
              color: "#b1b5c3",
              placeholderColor: "#000",
              autoFocus: true,
              isChangeValue,
              setIsChangeValue,
              errorBorderColor: "#fb5a5a",
              padding: "0 16px",
            }}
          />
          <Button
            type="submit"
            margin="13px 0 0 0"
            text="Finish"
            justify="center"
            height="48px"
            styledDisabled={!valid}
          />
        </Form>
        <Snackbar
          isOpen={isSnackbarOpen}
          message={snackbarError}
          close={() => setIsSnackbarOpen(false)}
          type="error"
          left="26px"
          bottom={"138px"}
          transform="translateX(0)"
        />
      </Content>
    </Container>
  );
}

export default reduxForm<Record<string, unknown>, any>({
  form: "EncodeAccount",
  validate: validPassword,
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
  margin-top: 103px;
`;

// const Circle = styled.div`
//   width: 180px;
//   height: 180px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: linear-gradient(265.71deg, #1cc3ce -32.28%, #b9e260 104.04%);
//   border-radius: 100%;
// `;

// const CircleInner = styled.div`
//   width: 94%;
//   height: 94%;
//   background-color: #f8f8f8;
//   border-radius: 100%;
// `;

// const CheckMarkContainer = styled.div`
//   position: absolute;
//   top: -15px;
//   right: -20px;
// `;

// const LockContainer = styled.div`
//   position: absolute;
//   top: 70px;
// `;

const Title = styled.div`
  font-size: 22px;
  margin: 28px 0 10px;
  font-family: 'IBM Plex Sans';
  font-weight: 500;
  text-align: center;
  line-height: 1.82;
  color: #18191a;
`;

const Description = styled.div`
  width: 251px;
  height: 38px;
  font-family: Inter;
  font-size: 14px;
  line-height: 1.35;
  text-align: center;
  color: #353945;
  margin-bottom: 28px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
