import styled from "styled-components";
import { isValidPolkadotAddress } from "utils/polkadot";
import { useEffect, useState } from "react";
import TokenAndAmountSelect from "pages/Send/TokenAndAmountSelect";
import ContactsIcon from "assets/svgComponents/ContactsIcon";
import WalletIcon from "assets/svgComponents/WalletIcon";
import HumbleInput from "components/primitives/HumbleInput";
import Button from "components/primitives/Button";
import RightArrow from "assets/svgComponents/RightArrow";

import ExchangeIcon from "assets/svgComponents/ExchangeIcon";
import { useWizard } from "react-use-wizard";
import QRPopup from "./QRPopup";
import Header from "pages/Wallet/Header";
import BigNumber from "bignumber.js";
import ContactsPopup from "./ContactsPopup";
import { isNumeric } from "utils/validations";
import { useDispatch, useSelector, connect } from "react-redux";
import { Field, change, reset, reduxForm, getFormSyncErrors, formValueSelector } from "redux-form";
import Snackbar from "components/Snackbar/Snackbar";
import { cryptoToFiat, fiatToCrypto, isObjectEmpty, objectToArray, truncateString } from "utils";
import NetworkIcons from "components/primitives/NetworkIcons";
import AccountsPopup from "./AccountsPopup";
import BarcodeSendIcon from "assets/svgComponents/BarcodeSendIcon";
import { PropsFromTokenDashboard } from "pages/Recieve/Receive";
import keyring from "@polkadot/ui-keyring";
import { AccountMeta, CurrencyType } from "utils/types";
import { FlowValue, SendAccountFlowEnum } from "./Send";
import HashtagIcon from "assets/svgComponents/HashtagIcon";
import { useHistory } from "react-router-dom";
import { router } from "router/router";
// import { EVMNetwork } from "networks/evm";
import EthSettingsIcon from "assets/svgComponents/EthSettingsIcon";
import GasSettingsPopup from "./GasSettingsPopup";
import { IEVMBuildTransaction, IEVMToBeSignTransaction } from "utils/evm/interfaces";
import { isEVMChain } from "utils/evm";

const validate = (values: { address: string; amount: number }) => {
  const errors: any = {};
  if (!values.address) {
    errors.address = "Please enter address";
  }
  if (values.address && !isValidPolkadotAddress(values.address)) {
    errors.address = "Please enter valid address";
  } else if (!values.amount) {
    errors.amount = "Please enter amount";
  } else if (values.amount && !isNumeric(values.amount)) {
    errors.amount = "Amount value must be integer value";
  }

  return errors;
};

// todo handleSubmit Typing
type Props = {
  flow: FlowValue | undefined;
  setFlow: (flow: FlowValue | undefined) => void;
  fee: string;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  handleSubmit?: any;
  errors?: any;
  setAbilityToTransfer: (abilityToTransfer: boolean) => void;
  abilityToTransfer: boolean;
  amount: string;
  propsFromTokenDashboard?: PropsFromTokenDashboard;
  accountMeta: AccountMeta | undefined;
  setAccountMeta: (accountMeta: AccountMeta) => void;
  setToBeSignTransaction: (toBeSignTransaction: IEVMToBeSignTransaction) => void;
  toBeSignTransactionParams: IEVMBuildTransaction | undefined;
  handleSaveEthSettings: (values: Record<string, string>) => void;
  currencyType: CurrencyType;
  setCurrencyType: (currencyType: CurrencyType) => void;
};

const handleShowAccountInput = (flow: string | undefined, address: string | undefined): boolean => {
  if (!flow) return false;
  if (flow === SendAccountFlowEnum.SendToAddress) return true;
  if (flow === SendAccountFlowEnum.SendToTrustedContact) return true;

  if (flow === SendAccountFlowEnum.SendToAccount && address) return true;
  if (flow === SendAccountFlowEnum.ScanQR && address) return true;

  return false;
};

function SendToken({
  flow,
  setFlow,
  fee,
  loading,
  setLoading,
  handleSubmit,
  errors,
  abilityToTransfer,
  setAbilityToTransfer,
  amount,
  propsFromTokenDashboard,
  accountMeta,
  setAccountMeta,
  setToBeSignTransaction,
  toBeSignTransactionParams,
  handleSaveEthSettings,
  currencyType,
  setCurrencyType,
}: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { nextStep, previousStep } = useWizard();

  const [isAccountsPopupOpen, setIsAccountsPopupOpen] = useState<boolean>(false);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState<boolean>(false);
  const [isContactsPopupOpen, setIsContactsPopupOpen] = useState<boolean>(false);
  const [isGasSettingsOpen, setIsGasSettingsOpen] = useState<boolean>(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>("");

  // todo proper typing
  const { selectedAsset } = useSelector((state: any) => state.sendToken);

  const { prices } = useSelector((state: any) => state.wallet);
  const chain = selectedAsset?.chain;
  const symbol = selectedAsset?.symbol;

  const price = chain && prices[chain.toLowerCase()]?.usd;

  // const handleClick = (isValid: boolean) => {
  //   if (!isValid) return;
  //   nextStep();
  //   // todo show error message
  // };

  // Todo revise if this can be refactored into single function
  const handleClickAccounts = () => {
    setIsAccountsPopupOpen(true);
    setFlow(SendAccountFlowEnum.SendToAccount);
  };

  const handleClickAccount = (account: { 
    address: string;
    ethAddress: string; 
    name: string;
    img: string;
    isEth: boolean;
  }) => {
    const { name, img, address, ethAddress, isEth } = account;
    dispatch(change("sendToken", "address", isEth ? ethAddress : address));
    setIsAccountsPopupOpen(false);

    setAccountMeta({ name, img });
  };

  // const handleCloseAccount = () => {
  //   setIsAccountsPopupOpen(false);
  //   setFlow(undefined);
  // };

  const handleClickQR = () => {
    setFlow(SendAccountFlowEnum.ScanQR);
    setIsQRPopupOpen(true);
  };

  const handleCloseQR = () => {
    setIsQRPopupOpen(false);
    setFlow(undefined);
  };

  const handleClickContacts = () => {
    setFlow(SendAccountFlowEnum.SendToTrustedContact);
    setIsContactsPopupOpen(true);
  };

  const handleCloseContacts = (address: string) => {
    dispatch(change("sendToken", "address", address));
    setIsContactsPopupOpen(false);

    const pair = keyring.getAddress(address);
    setAccountMeta({ name: pair?.meta?.name as string, img: pair?.meta?.img as string });
  };

  const handleGasSettings = () => {
    setIsGasSettingsOpen(true);
  };

  const submit = (values: any) => {
    const errors = validate(values);
    if (!isObjectEmpty(errors)) {
      if (isSnackbarOpen) return;
      const errArray = objectToArray(errors);
      setSnackbarError(errArray[0]);
      setIsSnackbarOpen(true);
      return;
    }

    nextStep();
  };

  const handleBack = () => {
    if (propsFromTokenDashboard?.fromTokenDashboard) {
      history.push({
        pathname: router.tokenDashboard,
        state: { asset: propsFromTokenDashboard?.asset },
      });
    } else {
      previousStep();
      dispatch(reset("sendToken"));
      setFlow(undefined);
    }
  };

  useEffect(() => {
    if (!abilityToTransfer && !loading) {
      setSnackbarError("No enough funds to make transfer");
      setIsSnackbarOpen(true);
    }
  }, [loading]);

  const isDisabled = (
    errors: Record<string, string>,
    loading: boolean,
    abilityToTransfer: boolean,
  ) => {
    if (!isObjectEmpty(errors)) return true;
    if (loading) return true;
    if (!abilityToTransfer) return true;
    return false;
  };

  const formatAddressValue = (value: string, flow: FlowValue | undefined) => {
    if (
      value &&
      (flow === SendAccountFlowEnum.SendToTrustedContact ||
        flow === SendAccountFlowEnum.SendToAccount)
    ) {
      return `${truncateString(accountMeta?.name as string)} (${truncateString(value)})`;
    }

    return value;
  };

  const handleCurrencyTypeChange = (amount: string, currencyType: CurrencyType, price: number) => {
    if (currencyType === CurrencyType.Crypto) {
      dispatch(change("sendToken", "amount", cryptoToFiat(Number(amount), price)));
      setCurrencyType(CurrencyType.Fiat);
      return;
    }

    dispatch(change("sendToken", "amount", fiatToCrypto(Number(amount), price)));
    setCurrencyType(CurrencyType.Crypto);
  };

  const handleAmount = (amount: string, price: number, currencyType: CurrencyType) => {
    if (!amount || !price) return "0.00";

    if (currencyType === CurrencyType.Fiat) {
      return fiatToCrypto(Number(amount), price).toFixed(8);
    }

    return new BigNumber(amount).times(price).toFormat(2);
  };

  const handleMax = (balance: string) => {
    const maxAmount = new BigNumber(balance).toNumber();
    dispatch(change("sendToken", "amount", maxAmount));
  };

  return (
    <Container>
      <Header
        title={`SEND ${symbol} (${chain})`}
        closeAction={() => {
          dispatch(reset("sendToken"));
          history.push(router.home);
        }}
        backAction={handleBack}
        smallIcon
        bgColor="#f2f2f2"
      />

      <Form onSubmit={handleSubmit(submit)}>
        <Content>
          <ContentItem>
            <ContentItemTitle>
              <span>Amount</span>
              <span onClick={() => handleMax(selectedAsset.balance.overall)}>Max</span>
            </ContentItemTitle>
            <TokenAndAmountSelect
              Icon={<NetworkIcons isSmallIcon width="28px" height="28px" chain={chain} />}
              tokens={[symbol]}
              fiatList={["USD"]}
              value={amount}
              currencyType={currencyType}
              price={price}
              onChangeCallback={() => {
                setLoading(true);
                setAbilityToTransfer(false);
              }}
            />

            <Price>
              <span>
                Balance:{" "}
                {new BigNumber(selectedAsset.balance.overall)
                  .minus(selectedAsset.balance.locked)
                  .toFixed(12)}{" "}
                {symbol?.toUpperCase()}
              </span>
              <span>
                {currencyType === CurrencyType.Crypto ? "$" : ""}{" "}
                {handleAmount(amount, price, currencyType)}
                {currencyType === CurrencyType.Crypto ? "USD" : symbol.toUpperCase()}
                <ExchangeIconContainer
                  onClick={() => handleCurrencyTypeChange(amount, currencyType, price)}>
                  <ExchangeIcon />
                </ExchangeIconContainer>
              </span>
            </Price>
          </ContentItem>
          {handleShowAccountInput(flow, "address") ? (
            <ContentItem>
              <ContentItemTitle>Send to</ContentItemTitle>
              <Field
                id="address"
                name="address"
                type="text"
                label="address"
                placeholder="Address"
                component={HumbleInput}
                format={(value: string) => formatAddressValue(value, flow)}
                props={{
                  type: "text",
                  bgColor: "#f3f3f3",
                  color: "#18191a",
                  placeholderColor: "#b1b5c3",
                  fontSize: "16px",
                  height: "48px",
                  marginTop: "5px",
                  accountMeta,
                  readOnly:
                    flow === SendAccountFlowEnum.SendToTrustedContact ||
                    flow === SendAccountFlowEnum.SendToAccount,

                  Icon: flow === SendAccountFlowEnum.SendToTrustedContact && (
                    <ContactsIcon stroke="#111" />
                  ),
                  IconAlignment:
                    flow === SendAccountFlowEnum.SendToTrustedContact ? "right" : "left",
                }}
              />
            </ContentItem>
          ) : (
            <ContentItem>
              <ContentItemTitle>Send to</ContentItemTitle>
              <SendTypes>
                <SendTypeItem onClick={() => setFlow(SendAccountFlowEnum.SendToAddress)}>
                  <IconContainer>
                    <HashtagIcon />
                  </IconContainer>
                  <Text>Address</Text>
                </SendTypeItem>

                <SendTypeItem onClick={handleClickAccounts}>
                  <IconContainer>
                    <WalletIcon stroke="#18191A" />
                  </IconContainer>
                  <Text>Accounts</Text>
                </SendTypeItem>

                <SendTypeItem onClick={handleClickContacts}>
                  <IconContainer>
                    <ContactsIcon />
                  </IconContainer>
                  <Text>Contacts</Text>
                </SendTypeItem>

                <SendTypeItem onClick={handleClickQR}>
                  <IconContainer>
                    <BarcodeSendIcon stroke="#111" />
                  </IconContainer>
                  <Text>Scan QR</Text>
                </SendTypeItem>
              </SendTypes>
            </ContentItem>
          )}
          <ContentItem>
            <Info>
              <InfoRow>
                <span>Network Fee</span>
                <InfoRowRIght>
                  <span>
                    {loading ? "..." : fee} {selectedAsset?.symbol.toUpperCase()}
                  </span>{" "}
                  {isEVMChain(chain) && (
                    <EthSettingsIconContainer loading={loading} onClick={handleGasSettings}>
                      <EthSettingsIcon />
                    </EthSettingsIconContainer>
                  )}
                </InfoRowRIght>
              </InfoRow>
              <InfoRow>
                <span>Max Total</span>
                <span>
                  {loading ? "..." : new BigNumber(amount).plus(fee).toString()}{" "}
                  {selectedAsset?.symbol.toUpperCase()}
                </span>
              </InfoRow>
            </Info>
          </ContentItem>

          {/* <ContentItem>
            <ContentItemTitle>Add Note (optional)</ContentItemTitle>
            <Field
              id="note"
              name="note"
              type="text"
              placeholder="Enter note"
              component={HumbleInput}
              props={{    
                type: "text",
                bgColor: "#f2f2f2",
                color: "#18191a",
                placeholderColor: "#b1b5c3",
                height: "45px",
                fontSize: "14px",
              }}
            />
          </ContentItem> */}

          <Snackbar
            isOpen={isSnackbarOpen}
            close={() => setIsSnackbarOpen(false)}
            message={snackbarError}
            type="error"
            left="50%"
            bottom="138px"
          />
        </Content>

        <BottomSection>
          <Button
            type="submit"
            text={loading ? "Calculating ability to transfer..." : "Preview Send"}
            justify="center"
            margin="13px 0 0"
            Icon={<RightArrow width={23} fill="#fff" />}
            disabled={isDisabled(errors, loading, abilityToTransfer)}
          />
        </BottomSection>
      </Form>

      {isAccountsPopupOpen && (
        <AccountsPopup
          onBack={() => {
            setIsAccountsPopupOpen(false);
            setFlow(undefined);
          }}
          handleClickAccount={handleClickAccount}
        />
      )}
      {isQRPopupOpen && <QRPopup handleCloseQR={handleCloseQR} />}
      {isContactsPopupOpen && (
        <ContactsPopup
          onBack={() => {
            setIsContactsPopupOpen(false);
            setFlow(undefined);
          }}
          closeAction={() => {
            dispatch(reset("sendToken"));
            history.push(router.home);
          }}
          handleCloseContacts={handleCloseContacts}
        />
      )}

      {isGasSettingsOpen && (
        <GasSettingsPopup
          onClose={() => setIsGasSettingsOpen(false)}
          setToBeSignTransaction={setToBeSignTransaction}
          toBeSignTransactionParams={toBeSignTransactionParams}
          handleSaveEthSettings={handleSaveEthSettings}
        />
      )}
    </Container>
  );
}

export default connect((state: any) => ({
  errors: getFormSyncErrors("sendToken")(state),
  amount: formValueSelector("sendToken")(state, "amount"),
  initialValues: {
    token: state.sendToken.selectedAsset.symbol,
  },
}))(
  reduxForm<Record<string, unknown>, Props>({
    form: "sendToken",
    validate,
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true,
  })(SendToken),
);

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f2f2f2;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
  padding-top: 92px;
`;

const Content = styled.div`
  padding: 0 26px;
  border-top-right-radius: 15px;
`;

const ContentItem = styled.div`
  margin-top: 17px;

  :nth-child(2) {
    margin-top: 24px;
  }

  :nth-child(3) {
    margin-top: 24px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const Price = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  color: #111;
  font-family: "IBM Plex Sans";
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: #18191a;
  overflow: hidden;
  span {
    display: flex;
  }
`;

const ExchangeIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px 0 6px;
  cursor: pointer;
`;

const ContentItemTitle = styled.p`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #62768a;
  font-family: "IBM Plex Sans";
  margin-bottom: 6px;

  span:nth-child(2) {
    color: #6366f1;
    cursor: pointer;
  }
`;

const SendTypes = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

const SendTypeItem = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0 4px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  border-radius: 5.8px;
  cursor: pointer;
`;

const AddressContainer = styled.div``;

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
`;

const Text = styled.span`
  font-family: "Inter";
  color: #181818;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 26px 29px;
  box-sizing: border-box;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-family: "IBM Plex Sans";
    font-size: 12px;
  }
`;

const InfoRowRIght = styled.div`
  display: flex;
  align-items: center;
`;

const EthSettingsIconContainer = styled.div<{ loading?: boolean }>`
  cursor: pointer;
  margin-left: 5px;
  opacity: ${({ loading }) => (loading ? "0.4" : "1")};
  pointer-events: ${({ loading }) => (loading ? "none" : "inherit")};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  &:nth-child(2) {
    margin-top: 12px;
  }

  span {
    font-family: "Inter";
    font-size: 14px;
  }
`;

// const AccountsSection = styled.div`
//   width: 100%;
//   height: 100%;
//   position: absolute;
//   z-index: 9999999999999999999;
//   bottom: 0;
//   box-sizing: border-box;
//   /* background-color: #f8f8f9; */
//   background-color: rgba(0, 0, 0, 0.6);
//   display: flex;
//   align-items: flex-end;
//   z-index: 10;
// `;

// const AccountsSectionContent = styled.div`
//   width: 100%;
//   min-height: 200px;
//   max-height: 80%;
//   background-color: #f8f8f9;
//   padding: 15px 20px;
//   border-top-right-radius: 5px;
//   border-top-left-radius: 5px;
//   overflow-y: scroll;
// `;

// const AccountsSectionContentHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   span {
//     font-family: Inter;
//     font-weight: 600;
//   }
// `;

// const CloseIconContainer = styled.div`
//   cursor: pointer;
// `;

// const AccountsSectionList = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
// `;

// const AccountsSectionItem = styled.div`
//   width: 100%;
//   height: 48px;
//   padding: 12.5px 71px 12.5px 9.3px;
//   box-sizing: border-box;
//   border-radius: 5px;
//   background-color: #f3f3f3;
//   margin-top: 10px;
//   cursor: pointer;
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;

//   :nth-child(1) {
//     margin-top: 20px;
//   }
// `;
