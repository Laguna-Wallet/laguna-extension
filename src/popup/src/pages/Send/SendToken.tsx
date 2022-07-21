import styled from 'styled-components';
import { isValidPolkadotAddress } from 'utils/polkadot';
import { useEffect, useState } from 'react';
import TokenAndAmountSelect from 'pages/Send/TokenAndAmountSelect';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';

import ExchangeIcon from 'assets/svgComponents/ExchangeIcon';
import { useWizard } from 'react-use-wizard';
import QRPopup from './QRPopup';
import Header from 'pages/Wallet/Header';
import BigNumber from 'bignumber.js';
import ContactsPopup from './ContactsPopup';
import { isNumeric } from 'utils/validations';
import { useDispatch, useSelector, connect } from 'react-redux';
import { Field, change, reset, reduxForm, getFormSyncErrors, formValueSelector } from 'redux-form';
import Snackbar from 'components/Snackbar/Snackbar';
import { isObjectEmpty, objectToArray, truncateString } from 'utils';
import NetworkIcons from 'components/primitives/NetworkIcons';
import AccountsPopup from './AccountsPopup';
import BarcodeSendIcon from 'assets/svgComponents/BarcodeSendIcon';
import { PropsFromTokenDashboard } from 'pages/Recieve/Receive';
import keyring from '@polkadot/ui-keyring';
import { AccountMeta } from 'utils/types';
import { FlowValue, SendAccountFlowEnum } from './Send';
import HashtagIcon from 'assets/svgComponents/HashtagIcon';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

const validate = (values: { address: string; amount: number }) => {
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
  propsFromTokenDashboard?: PropsFromTokenDashboard;
  accountMeta: AccountMeta | undefined;
  setAccountMeta: (accountMeta: AccountMeta) => void;
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
  propsFromTokenDashboard,
  accountMeta,
  setAccountMeta
}: Props) {
  const history = useHistory();

  const dispatch = useDispatch();
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
      history.push({
        pathname: router.tokenDashboard,
        state: { asset: propsFromTokenDashboard?.asset }
      });
    } else {
      previousStep();
      dispatch(reset('sendToken'));
      setFlow(undefined);
    }
  };

  useEffect(() => {
    if (!abilityToTransfer && !loading) {
      setSnackbarError('No enough funds to make transfer');
      setIsSnackbarOpen(true);
    }
  }, [loading]);

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
        title={`SEND ${selectedAsset?.symbol} (${selectedAsset?.chain})`}
        closeAction={() => {
          dispatch(reset('sendToken'));
          history.push(router.home);
        }}
        backAction={handleBack}
        smallIcon
        bgColor="#f2f2f2"
      />

      <Form onSubmit={handleSubmit(submit)}>
        <Content>
          <ContentItem>
            <ContentItemTitle>Amount</ContentItemTitle>
            <TokenAndAmountSelect
              Icon={
                <NetworkIcons isSmallIcon width="28px" height="28px" chain={selectedAsset?.chain} />
              }
              tokens={[selectedAsset.symbol]}
              value={amount}
            />

            <Price>
              <span>
                ${amount && price ? new BigNumber(amount).times(price).toFormat(2) : '0.00'} USD
              </span>
              <ExchangeIconContainer>
                <ExchangeIcon />
              </ExchangeIconContainer>
            </Price>
          </ContentItem>
          {handleShowAccountInput(flow, 'address') ? (
            <ContentItem>
              <ContentItemTitle>Send to</ContentItemTitle>
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
                    flow === SendAccountFlowEnum.SendToAccount,

                  Icon: flow === SendAccountFlowEnum.SendToTrustedContact && (
                    <ContactsIcon stroke="#111" />
                  ),
                  IconAlignment:
                    flow === SendAccountFlowEnum.SendToTrustedContact ? 'right' : 'left'
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
            <ContentItemTitle>Add Note (optional)</ContentItemTitle>
            <Field
              id="note"
              name="note"
              type="text"
              placeholder="Enter note"
              component={HumbleInput}
              props={{
                type: 'text',
                bgColor: '#f2f2f2',
                color: '#18191a',
                placeholderColor: '#b1b5c3',
                height: '45px',
                fontSize: '14px'
              }}
            />
          </ContentItem>

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
          <Info>
            <InfoRow>
              <span>Transferable Balance</span>
              <span>
                {new BigNumber(selectedAsset.balance.overall)
                  .minus(selectedAsset.balance.locked)
                  .toString()}{' '}
                {selectedAsset?.symbol.toUpperCase()}
              </span>
            </InfoRow>
            <InfoRow>
              <span>Estimated Fee</span>
              <span>
                {loading ? '...' : new BigNumber(fee).toString()}{' '}
                {selectedAsset?.symbol.toUpperCase()}
              </span>
            </InfoRow>
          </Info>
          <Button
            type="submit"
            text={loading ? 'Calculating ability to transfer...' : 'Preview Send'}
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
            dispatch(reset('sendToken'));
            history.push(router.home);
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
  padding-top: 92px;
`;

const Content = styled.div`
  padding: 0 26px;
  border-top-right-radius: 15px;
`;

const ContentItem = styled.div`
  margin-top: 17px;

  :nth-child(2) {
    margin-top: 7px;
  }

  :nth-child(3) {
    margin-top: 28px;
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
  justify-content: flex-end;
  align-items: center;
  margin-top: 6px;
  color: #111;
  font-family: 'IBM Plex Sans';
  font-size: 12px;
  line-height: 14px;
  text-align: right;
  color: #18191a;
  overflow: hidden;
`;

const ExchangeIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px 0 6px;
  cursor: pointer;
`;

const ContentItemTitle = styled.p`
  font-size: 12px;
  color: #18191a;
  font-family: 'IBM Plex Sans';
  margin-bottom: 8px;
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
  font-family: 'IBM Plex Sans';
  color: #353945;
  font-weight: 400;
  font-size: 10px;
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
    font-family: 'IBM Plex Sans';
    font-size: 12px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  &:nth-child(2) {
    margin-top: 8px;
  }
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
    font-family: Inter;
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
