import styled from "styled-components/macro";
import { PlusIcon } from "@heroicons/react/outline";
import keyring from "@polkadot/ui-keyring";
import AddressBookIcon from "assets/svgComponents/AdressBookIcon";
import ContactsIcon from "assets/svgComponents/ContactsIcon";
import LoopIcon from "assets/svgComponents/loopIcon";
import Button from "components/primitives/Button";
import HumbleInput from "components/primitives/HumbleInput";
import AddAddress from "pages/AddressBook/AddAddress";
import Header from "pages/Wallet/Header";
import { useEffect, useState } from "react";
import { truncateString } from "utils";
import BackIcon from "assets/svgComponents/CopyIcon";
import LeftArrowIcon from "assets/svgComponents/LeftArrowIcon";
import CloseIcon from "assets/svgComponents/CloseIcon";
import HintIcon from "assets/svgComponents/HintIcon";
import HintIconSmall from "assets/svgComponents/HintIconSmall";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { IEVMBuildTransaction, IEVMToBeSignTransaction } from "utils/evm/interfaces";
import { connect } from "react-redux";
import BigNumber from "bignumber.js";
import { buildEvmTransaction } from "utils/evm/api";

// todo proper handleSubmit Typing
type Props = {
  onClose: () => void;
  setToBeSignTransaction: (toBeSignTransaction: IEVMToBeSignTransaction) => void;
  toBeSignTransactionParams: IEVMBuildTransaction | undefined;
  handleSubmit?: any;
};

function GasSettingsPopup({
  handleSubmit,
  onClose,
  setToBeSignTransaction,
  toBeSignTransactionParams,
}: Props) {
  const submit = async (values: any) => {
    const gasLimit = new BigNumber(values.gasLimit);
    const gasPriceInGwei = new BigNumber(values.gasPrice);
    const nonce = new BigNumber(values.nonce);

    const toSignTransaction: IEVMToBeSignTransaction = await buildEvmTransaction({
      ...toBeSignTransactionParams,
      gasLimit,
      gasPriceInGwei,
      nonce,
    } as IEVMBuildTransaction);

    setToBeSignTransaction(toSignTransaction);

    onClose();
  };

  return (
    <Container>
      <InnerContainer>
        <Heading>
          <BackButtonContainer onClick={onClose}>
            <LeftArrowIcon />
          </BackButtonContainer>
          <Title>Advanced</Title>
          <HeadingRight>
            <HintIconContainer>
              <HintIcon />
            </HintIconContainer>
            <CloseButtonContainer onClick={onClose}>
              <CloseIcon />
            </CloseButtonContainer>
          </HeadingRight>
        </Heading>
        <TextRow>
          <TextRowRight>
            <span>Current gas price</span>
            <HintIconSmallContainer>
              <HintIconSmall />
            </HintIconSmallContainer>
          </TextRowRight>
          <span>14.234 Gwei</span>
        </TextRow>
        <Form onSubmit={handleSubmit(submit)}>
          <Field
            id="gasPrice"
            name="gasPrice"
            type="text"
            placeholder="Gas price in Gwei"
            component={HumbleInput}
            props={{
              type: "text",
              topLabel: "Gas Price (Gwei)",
              bgColor: "#fff",
              padding: "15px 11px 15px 16px",
              color: "#11171D",
              placeholderColor: "#b1b5c3",
              errorBorderColor: "#fb5a5a",
              height: "48px",
              marginTop: "12px",
              borderColor: "#c4d0d9",
              // showError: true,
              // errorColor: '#FB5A5A'
            }}
          />
          <Field
            id="gasLimit"
            name="gasLimit"
            type="text"
            label="Gas Limit"
            placeholder="Gas limit"
            component={HumbleInput}
            props={{
              type: "text",
              bgColor: "#fff",
              topLabel: "Gas Limit",
              padding: "15px 11px 15px 16px",
              color: "#11171D",
              placeholderColor: "#b1b5c3",
              errorBorderColor: "#fb5a5a",
              height: "48px",
              marginTop: "12px",
              borderColor: "#c4d0d9",
              // showError: true,
              // errorColor: '#FB5A5A'
            }}
          />
          <Field
            id="nonce"
            name="nonce"
            type="text"
            label="Nonce"
            placeholder="Nonce"
            component={HumbleInput}
            props={{
              type: "text",
              bgColor: "#fff",
              topLabel: "Nonce",
              padding: "15px 11px 15px 16px",
              color: "#11171D",
              placeholderColor: "#b1b5c3",
              errorBorderColor: "#fb5a5a",
              height: "48px",
              marginTop: "12px",
              borderColor: "#c4d0d9",
              // showError: true,
              // errorColor: '#FB5A5A'
            }}
          />
          <Button
            type="submit"
            text="Save"
            color="#fff"
            bgColor="#11171D"
            borderColor="#11171D"
            justify="center"
            margin="auto 0 16px 0"
          />
        </Form>
      </InnerContainer>
    </Container>
  );
}

export default connect((state: any, props: Props) => ({
  initialValues: {
    gasPrice: props?.toBeSignTransactionParams?.gasPriceInGwei?.toString(),
    gasLimit: props?.toBeSignTransactionParams?.gasLimit?.toString(),
    nonce: props?.toBeSignTransactionParams?.nonce?.toString(),
  },
  // errors: getFormSyncErrors("CreatePassword")(state),
}))(
  reduxForm<Record<string, unknown>, Props>({
    form: "GasSettingsPopup",
    // validate,
  })(GasSettingsPopup),
);

const Container = styled.div<{ bg?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(26, 26, 26, 0.7);
  background-size: cover;
  padding-top: 92px;
  position: absolute;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 24px 16px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px 10px 0px 0px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackButtonContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.span`
  font-family: "Inter";
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 0.25px;
  color: #11171d;
`;

const HeadingRight = styled.div`
  display: flex;
  align-items: center;
`;

const CloseButtonContainer = styled.div`
  cursor: pointer;
  margin-left: 5px;
`;

const HintIconContainer = styled.div`
  cursor: pointer;
`;

const TextRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 35px;
  font-family: "Inter";
  font-size: 14px;
  letter-spacing: 0.25px;
  color: #11171d;
`;

const TextRowRight = styled.div`
  display: flex;
  align-items: center;
  color: #62768a;
`;

const HintIconSmallContainer = styled.div`
  margin-top: 5px;
  margin-left: 3px;
`;

const Form = styled.form`
  width: 100%;
  height: 83%;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;
