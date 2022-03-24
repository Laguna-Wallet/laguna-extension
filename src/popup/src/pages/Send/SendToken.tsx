import styled from 'styled-components';
import { goTo, Link } from 'react-chrome-extension-router';
import { getAccounts, getApiInstance, isValidPolkadotAddress } from 'utils/polkadot';
import { Dispatch, useEffect, useState } from 'react';
import TokenAndAmountSelect from 'pages/Send/TokenAndAmountSelect';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
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
import { getAccountImage, isObjectEmpty, objectToArray, truncateString } from 'utils';
import Wallet from 'pages/Wallet/Wallet';
import NetworkIcons from 'components/primitives/NetworkIcons';
import AccountsPopup from './AccountsPopup';
import BarcodeSendIcon from 'assets/svgComponents/BarcodeSendIcon';
import { PropsFromTokenDashboard } from 'pages/Recieve/Receive';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import keyring from '@polkadot/ui-keyring';
import { AccountMeta } from 'utils/types';
import { FlowValue, SendAccountFlowEnum } from './Send';

const validate = (values: any) => {
  const errors: any = {};
  if (!values.address) {
    errors.address = 'Please enter address';
  }
  if (values.address && !isValidPolkadotAddress(values.address)) {
    errors.address = 'Please enter valid address';
  } else if (!values.amount) {
    errors.amount = 'Please enter amount';
  } else if (values.amount && !isNumeric(values.amount)) {
    errors.amount = 'Amount value must be integer value';
  }

  return errors;
};

// todo handleSubmit Typing
type Props = {
  flow: FlowValue | undefined;
  setFlow: (flow: FlowValue | undefined) => void;
  fee: string;
  loading: boolean;
  handleSubmit?: any;
  errors?: any;
  abilityToTransfer: boolean;
  amount: string;
  propsFromTokenDashboard: PropsFromTokenDashboard;
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
  amount,
  propsFromTokenDashboard
}: Props) {
  const dispatch = useDispatch();
  const { nextStep, previousStep } = useWizard();

  const [isAccountsPopupOpen, setIsAccountsPopupOpen] = useState<boolean>(false);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState<boolean>(false);
  const [isContactsPopupOpen, setIsContactsPopupOpen] = useState<boolean>(false);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarError, setSnackbarError] = useState<string>('');

  const [accountMeta, setAccountMeta] = useState<AccountMeta>();

  // todo proper typing
  const { selectedAsset } = useSelector((state: any) => state.sendToken);
  const { prices } = useSelector((state: any) => state.wallet);

  const price = selectedAsset?.chain && prices[selectedAsset.chain]?.usd;

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

  const handleClickAccount = (address: string) => {
    dispatch(change('sendToken', 'address', address));
    setIsAccountsPopupOpen(false);

    const pair = keyring.getPair(address);
    setAccountMeta({ name: pair?.meta?.name as string, img: pair?.meta?.img as string });
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
    dispatch(change('sendToken', 'address', address));
    setIsContactsPopupOpen(false);

    const pair = keyring.getAddress(address);
    setAccountMeta({ name: pair?.meta?.name as string, img: pair?.meta?.img as string });
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
      goTo(TokenDashboard, { asset: propsFromTokenDashboard.asset });
    } else {
      previousStep();
      dispatch(reset('sendToken'));
      setFlow(undefined);
    }
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

  return (
    <Container>
      <Header
        title={`SEND ${selectedAsset?.symbol}  (${selectedAsset?.chain})`}
        closeAction={() => {
          dispatch(reset('sendToken'));
          goTo(Wallet);
        }}
        backAction={handleBack}
        bgColor="#f2f2f2"
      />
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
              <AddressContainer>Send to</AddressContainer>
              <Field
                id="address"
                name="address"
                type="text"
                label="address"
                placeholder="address"
                component={HumbleInput}
                format={(value: string) => formatAddressValue(value, flow)}
                props={{
                  type: 'text',
                  bgColor: '#f3f3f3',
                  color: '#18191a',
                  placeholderColor: '#b1b5c3',
                  fontSize: '16px',
                  height: '48px',
                  marginTop: '5px',
                  accountMeta,
                  readOnly:
                    flow === SendAccountFlowEnum.SendToTrustedContact ||
                    flow === SendAccountFlowEnum.SendToAccount

                  // Icon: <NetworkIcons chain={selectedAsset?.chain} />
                }}
              />
            </ContentItem>
          ) : (
            <ContentItem>
              <ContentItemTitle>Send to</ContentItemTitle>
              <SendTypes>
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

                <SendTypeItem onClick={handleClickContacts}>
                  <IconContainer>
                    <ContactsIcon stroke="#111" />
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
            <ContentItemTitle>Add Note (Optional)</ContentItemTitle>
            <Field
              id="note"
              name="note"
              type="text"
              placeholder="Enter note here"
              component={HumbleInput}
              props={{
                type: 'text',
                bgColor: '#f2f2f2',
                color: '#18191a',
                placeholderColor: '#b1b5c3',
                height: '53px',
                marginTop: '5px',
                fontSize: '14px'
              }}
            />
            {/* <HumbleInput
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
            /> */}
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
            <span>
              Estimated Fee: {loading ? '...' : new BigNumber(fee).toFormat(4)}{' '}
              {selectedAsset?.symbol.toUpperCase()}
            </span>
          </Info>
          <Button
            type="submit"
            text={loading ? 'Calculating ability to transfer...' : 'Preview Send'}
            justify="center"
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
          handleCloseContacts={handleCloseContacts}
        />
      )}
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
  padding-top: 110px;
`;

const Content = styled.div`
  padding: 0 15px;
  border-top-right-radius: 15px;
`;

const ContentItem = styled.div`
  margin-top: 15px;

  :nth-child(3) {
    margin-top: 28px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  padding-bottom: 38px;
`;

const Price = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
  color: #111;
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  line-height: 1.35;
  text-align: right;
  color: #18191a;
`;

const ExchangeIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 2px;
  cursor: pointer;
`;

const ContentItemTitle = styled.span`
  font-size: 12px;
  color: #18191a;
  font-family: 'IBM Plex Sans';
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
  background-color: #f2f2f2;
  border-radius: 5.8px;
  cursor: pointer;
`;

const AddressContainer = styled.div``;

const IconContainer = styled.div`
  /* width: 35px;
  height: 35px; */
`;

const Text = styled.span`
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  color: #353945;
  margin-top: 3px;
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
    font-family: 'IBM Plex Sans';
    font-size: 12px;
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
