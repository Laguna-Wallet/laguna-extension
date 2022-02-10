import styled from 'styled-components';
import { goTo, Link } from 'react-chrome-extension-router';
import { getAccounts, getApiInstance, isValidAddressPolkadotAddress } from 'utils/polkadot';
import { Dispatch, useEffect, useState } from 'react';
import TokenAndAmountSelect from 'pages/Send/TokenAndAmountSelect';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import SharpIcon from 'assets/svgComponents/SharpIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';
import Confirm from './Confirm';

import ExchangeIcon from 'assets/svgComponents/ExchangeIcon';
import { FormikProps } from 'formik';
import { useWizard } from 'react-use-wizard';
import { useAccount } from 'context/AccountContext';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import QRPopup from './QRPopup';
import Header from 'pages/Wallet/Header';
import BigNumber from 'bignumber.js';
import ContactsPopup from './ContactsPopup';
import { isNumeric, sendTokenSchema } from 'utils/validations';
import { validator } from 'utils/validator';
import { changeAddress, changeAmount, selectAssetToken } from 'redux/actions';
import { useDispatch, useSelector, connect } from 'react-redux';
import {
  Field,
  change,
  reset,
  getFormError,
  getFormValues,
  reduxForm,
  getFormSyncErrors,
  formValueSelector
} from 'redux-form';
import Snackbar from 'components/Snackbar/Snackbar';
import { isObjectEmpty, objectToArray } from 'utils';

// const renderInputElement = ({ input, label, type, meta: { touched, error, warning } }: any) => (
//   <SelectContainer>
//     <StyledInput placeholder="Enter Amount" type {...input} />

//     {/* <StyledSelect defaultValue={defaultValue} onChange={handleChange} name="dots" id="dots">
//       {options.map((symbol) => (
//         <StyledOption key={symbol} value={symbol}>
//           {symbol.toUpperCase()}
//         </StyledOption>
//       ))}
//     </StyledSelect> */}
//   </SelectContainer>
// );

const validate = (values: any) => {
  const errors: any = {};
  if (!values.address) {
    errors.address = 'Please enter address';
  }
  if (values.address && !isValidAddressPolkadotAddress(values.address)) {
    errors.address = 'Please enter valid address';
  } else if (!values.amount) {
    errors.amount = 'Please enter amount';
  } else if (values.amount && !isNumeric(values.amount)) {
    errors.amount = 'Amount value must be integer value';
  }

  return errors;
};

enum SendAccountFlowEnum {
  SendToTrustedContact = 'SendToTrustedContact',
  SendToAddress = 'SendToAddress',
  SendToAccount = 'SendToAccount',
  ScanQR = 'ScanQR'
}

// todo handleSubmit Typing
type Props = {
  flow: string | undefined;
  setFlow: (flow: string | undefined) => void;
  fee: string;
  loading: boolean;
  handleSubmit?: any;
  errors?: any;
  abilityToTransfer: boolean;
  amount: string;
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
  handleSubmit,
  errors,
  abilityToTransfer,
  amount
}: Props) {
  const dispatch = useDispatch();
  const account = useAccount();
  const { nextStep, previousStep } = useWizard();
  const [isAccountsPopupOpen, setIsAccountsPopupOpen] = useState<boolean>(false);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState<boolean>(false);
  const [isContactsPopupOpen, setIsContactsPopupOpen] = useState<boolean>(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  // todo proper typing
  const { selectedAsset } = useSelector((state: any) => state.sendToken);
  const { prices } = useSelector((state: any) => state.wallet);

  const price = selectedAsset?.chain && prices[selectedAsset.chain]?.usd;

  const handleClick = (isValid: boolean) => {
    if (!isValid) return;
    nextStep();
    // todo show error message
  };

  // Todo revise if this can be refactored into single function
  const handleClickAccounts = () => {
    setIsAccountsPopupOpen(true);
    setFlow(SendAccountFlowEnum.SendToAddress);
  };

  const handleClickAccount = (address: string) => {
    dispatch(change('sendToken', 'address', address));
    setIsAccountsPopupOpen(false);

    // change
  };

  const handleCloseAccount = () => {
    setIsAccountsPopupOpen(false);
    setFlow(undefined);
  };

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
    console.log('~ address', address);
    dispatch(changeAddress(address));
    // setIsContactsPopupOpen(false);
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
    previousStep();
    dispatch(reset('sendToken'));
    setFlow(undefined);
  };

  useEffect(() => {
    if (!abilityToTransfer) {
      setSnackbarError('No enough founds to make transfer');
      setIsSnackbarOpen(true);
    }
  }, [abilityToTransfer]);

  const isDisabled = (
    errors: Record<string, string>,
    loading: boolean,
    abilityToTransfer: boolean
  ) => {
    if (!isObjectEmpty(errors)) return true;
    if (loading) return true;
    if (!abilityToTransfer) return true;
    return false;
  };

  return (
    <Container>
      <Header title={`SEND ${selectedAsset?.chain}`} backAction={handleBack} />
      <Form onSubmit={handleSubmit(submit)}>
        <Content>
          <ContentItem>
            <ContentItemTitle>Amount</ContentItemTitle>

            <TokenAndAmountSelect tokens={[selectedAsset.symbol]} />

            <Price>
              <span>{amount && price && '$' + new BigNumber(amount).times(price).toFormat(2)}</span>
              <ExchangeIconContainer>
                <ExchangeIcon />
              </ExchangeIconContainer>
            </Price>
          </ContentItem>
          {handleShowAccountInput(flow, 'address') ? (
            <ContentItem>
              <AddressContainer>To</AddressContainer>
              <Field
                id="address"
                name="address"
                type="text"
                label="address"
                placeholder="address"
                component={HumbleInput}
                props={{
                  type: 'text',
                  bgColor: '#f3f3f3',
                  color: '#111',
                  height: '53px',
                  marginTop: '5px'
                }}
              />
            </ContentItem>
          ) : (
            <ContentItem>
              <ContentItemTitle>To</ContentItemTitle>
              <SendTypes>
                <SendTypeItem onClick={handleClickContacts}>
                  <IconContainer>
                    <ContactsIcon stroke="#111" />
                  </IconContainer>
                  <Text>Contacts</Text>
                </SendTypeItem>

                <SendTypeItem onClick={() => setFlow(SendAccountFlowEnum.SendToAddress)}>
                  <IconContainer>
                    <SharpIcon />
                  </IconContainer>
                  <Text>Address</Text>
                </SendTypeItem>

                <SendTypeItem onClick={handleClickAccounts}>
                  <IconContainer>
                    <WalletIcon stroke="#111" />
                  </IconContainer>
                  <Text>Accounts</Text>
                </SendTypeItem>

                <SendTypeItem onClick={handleClickQR}>
                  <IconContainer>
                    <BarcodeIcon stroke="#111" />
                  </IconContainer>
                  <Text>Scan QR</Text>
                </SendTypeItem>
              </SendTypes>
            </ContentItem>
          )}

          <ContentItem>
            <ContentItemTitle>Add Note</ContentItemTitle>
            <HumbleInput
              id="note"
              placeholder="Enter note here"
              type="text"
              value=""
              onChange={() => undefined}
              // value={formik.values.note}
              // onChange={formik.handleChange}
              bgColor="#f3f3f3"
              height="53px"
              marginTop="5px"
            />
          </ContentItem>

          <Snackbar
            isOpen={isSnackbarOpen}
            close={() => setIsSnackbarOpen(false)}
            message={snackbarError}
            type="error"
            left="0px"
            bottom="138px"
          />
        </Content>

        <BottomSection>
          <Info>
            <span>
              Balance: {new BigNumber(selectedAsset.balance).toFormat(2)}{' '}
              {selectedAsset?.symbol.toUpperCase()}
            </span>
            <span>Estimated Fee: {loading ? '...' : new BigNumber(fee).toFormat(4)}</span>
          </Info>
          <Button
            type="submit"
            text={loading ? 'Calculating ability to transfer...' : 'Preview'}
            justify="center"
            Icon={<RightArrow width={23} fill="#fff" />}
            disabled={isDisabled(errors, loading, abilityToTransfer)}
          />
        </BottomSection>
      </Form>

      {isAccountsPopupOpen && (
        <AccountsSection>
          <AccountsSectionContent>
            <AccountsSectionContentHeader>
              <span>Select Receiving Account</span>
              <CloseIconContainer onClick={handleCloseAccount}>
                <CloseIcon stroke="#111" />
              </CloseIconContainer>
            </AccountsSectionContentHeader>
            <AccountsSectionList>
              {getAccounts().map(({ address }) => (
                <AccountsSectionItem onClick={() => handleClickAccount(address)} key={address}>
                  {address}
                </AccountsSectionItem>
              ))}
            </AccountsSectionList>
          </AccountsSectionContent>
        </AccountsSection>
      )}

      {isQRPopupOpen && <QRPopup handleCloseQR={handleCloseQR} />}
      {isContactsPopupOpen && <ContactsPopup handleCloseContacts={handleCloseContacts} />}
    </Container>
  );
}

export default connect((state: any) => ({
  errors: getFormSyncErrors('sendToken')(state),
  amount: formValueSelector('sendToken')(state, 'amount'),
  initialValues: {
    token: state.sendToken.selectedAsset.symbol
  }
}))(
  reduxForm<Record<string, unknown>, Props>({
    form: 'sendToken',
    validate,
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    updateUnregisteredFields: true
  })(SendToken)
);

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-bottom: 38px;
  padding-top: 110px;
`;

const Content = styled.div`
  padding: 0 15px;
`;

const ContentItem = styled.div`
  margin-top: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 53px;
  border: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #f3f3f3;
  color: #898989;
  font-family: 'SFCompactDisplayRegular';
  font-size: 16px;

  &:focus {
    outline: none;
  }
`;

const StyledSelect = styled.select`
  width: 70px;
  height: 53px;
  border: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #f3f3f3;
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  font-family: 'SFCompactDisplayRegular';

  &:focus {
    outline: none;
  }
`;

const StyledOption = styled.option``;

const Price = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
  color: #111;
  font-family: SFCompactDisplayRegular;
`;

const ExchangeIconContainer = styled.div`
  margin-left: 5px;
  cursor: pointer;
`;

const ContentItemTitle = styled.span`
  font-family: 'SFCompactDisplayRegular';
  font-size: 16px;
  color: #141414;
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
  padding: 10px 0;
  box-sizing: border-box;
  background-color: #f3f3f3;
  border-radius: 5.8px;
  cursor: pointer;
`;

const AddressContainer = styled.div``;

const IconContainer = styled.div`
  /* width: 35px;
  height: 35px; */
`;

const Text = styled.span`
  font-family: 'SFCompactDisplayRegular';
  font-size: 12px;
  color: #898989;
  margin-top: 3px;
  font-weight: 500;
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: auto;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    font-family: SFCompactDisplayRegular;
    font-size: 13.4px;
  }
`;

const LinkContainer = styled.div`
  pointer-events: none;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const AccountsSection = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9999999999999999999;
  bottom: 0;
  box-sizing: border-box;
  /* background-color: #f8f8f9; */
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 10;
`;

const AccountsSectionContent = styled.div`
  width: 100%;
  min-height: 200px;
  max-height: 80%;
  background-color: #f8f8f9;
  padding: 15px 20px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  overflow-y: scroll;
`;

const AccountsSectionContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    font-family: SFCompactDisplayRegular;
    font-weight: 600;
  }
`;

const CloseIconContainer = styled.div`
  cursor: pointer;
`;

const AccountsSectionList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const AccountsSectionItem = styled.div`
  width: 100%;
  height: 48px;
  padding: 12.5px 71px 12.5px 9.3px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: #f3f3f3;
  margin-top: 10px;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  :nth-child(1) {
    margin-top: 20px;
  }
`;
