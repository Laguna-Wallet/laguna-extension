import styled from 'styled-components';
import { goTo, Link } from 'react-chrome-extension-router';
import { calculateSelectedTokenExchange, getAccounts, getApiInstance } from 'utils/polkadot';
import { Dispatch, useEffect, useState } from 'react';
import Select from 'pages/Send/SelectTokenAndAmount';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import SharpIcon from 'assets/svgComponents/SharpIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';
import Confirm from './Confirm';
import { SendTokenActions, SendTokenFormikValues, SendTokenState } from './Send';

import ExchangeIcon from 'assets/svgComponents/ExchangeIcon';
import { FormikProps } from 'formik';
import { useWizard } from 'react-use-wizard';
import { useAccount } from 'context/AccountContext';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import QRPopup from './QRPopup';
import Header from 'pages/Wallet/Header';
import BigNumber from 'bignumber.js';
import ContactsPopup from './ContactsPopup';

import { useDispatch } from 'react-redux';
import { changeAddress, changeAmount, selectAssetToken } from 'redux/actions';
import { useSelector } from 'react-redux';

enum SendAccountFlowEnum {
  SendToTrustedContact = 'SendToTrustedContact',
  SendToAddress = 'SendToAddress',
  SendToAccount = 'SendToAccount',
  ScanQR = 'ScanQR'
}

type Props = {
  state: SendTokenState;
  dispatch: Dispatch<SendTokenActions>;
  formik: FormikProps<SendTokenFormikValues>;
  flow: string | undefined;
  setFlow: (flow: string | undefined) => void;
  fee: string;
  loading: boolean;
};

const handleShowAccountInput = (flow: string | undefined, address: string | undefined): boolean => {
  if (!flow) return false;
  if (flow === SendAccountFlowEnum.SendToAddress) return true;
  if (flow === SendAccountFlowEnum.SendToTrustedContact) return true;
  if (flow === SendAccountFlowEnum.SendToAccount && address) return true;
  if (flow === SendAccountFlowEnum.ScanQR && address) return true;

  return false;
};

export default function SendToken({ state, dispatch, formik, flow, setFlow, fee, loading }: Props) {
  const dispatchFromRedux = useDispatch();

  const { nextStep, previousStep } = useWizard();
  const account = useAccount();

  const [isAccountsPopupOpen, setIsAccountsPopupOpen] = useState<boolean>(false);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState<boolean>(false);
  const [isContactsPopupOpen, setIsContactsPopupOpen] = useState<boolean>(false);

  const handleClick = (isValid: boolean) => {
    console.log('~ isValid', isValid);
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
    setIsAccountsPopupOpen(false);
    formik.setFieldValue('address', address);
  };

  const handleCloseAccount = () => {
    setIsAccountsPopupOpen(false);
    if (!formik.values.address) {
      setFlow(undefined);
    }
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
    setIsContactsPopupOpen(false);
    dispatchFromRedux(changeAddress(address));
  };

  // todo proper typing
  const address = useSelector((state: any) => state.sendToken.address);
  const selectedAsset = useSelector((state: any) => state.sendToken.selectedAsset);
  const selectedAssetToken = useSelector((state: any) => state.sendToken.selectedAssetToken);
  const amount = useSelector((state: any) => state.sendToken.amount);

  return (
    <Container>
      <Header title={`SEND ${selectedAsset?.chain}`} backAction={previousStep} />
      <Content>
        <ContentItem>
          <ContentItemTitle>Amount</ContentItemTitle>

          {/* todo make so that options were with multiple tokens  */}
          <Select
            token={selectedAssetToken}
            onChangeToken={(token: string) => dispatchFromRedux(selectAssetToken(token))}
            amount={amount}
            onChangeAmount={(amount: string) => dispatchFromRedux(changeAmount(amount))}
            options={[selectedAsset.symbol]}
            defaultValue={selectedAsset.symbol}
          />
          <Price>
            <span>
              $
              {new BigNumber(
                calculateSelectedTokenExchange(
                  formik.values.amount,
                  formik.values?.selectedAsset?.price as number
                )
              ).toFixed(2)}
            </span>
            <ExchangeIconContainer>
              <ExchangeIcon />
            </ExchangeIconContainer>
          </Price>
        </ContentItem>
        {handleShowAccountInput(flow, formik.values.address) ? (
          <ContentItem>
            <AddressContainer>To</AddressContainer>
            <HumbleInput
              id="address"
              placeholder="Address"
              type="text"
              value={address}
              onChange={(e: any) => dispatchFromRedux(changeAddress(e.target.value))}
              bgColor="#f3f3f3"
              color="#111"
              height="53px"
              marginTop="5px"
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
            value={formik.values.note}
            onChange={formik.handleChange}
            bgColor="#f3f3f3"
            height="53px"
            marginTop="5px"
          />
        </ContentItem>
      </Content>

      <BottomSection>
        <Info>
          <span>
            Balance: {new BigNumber(selectedAsset.balance).toFixed(2)}{' '}
            {selectedAsset?.symbol.toUpperCase()}
          </span>
          <span>Estimated Fee: {loading ? '...' : new BigNumber(fee).toFixed(3)}</span>
        </Info>
        <Button
          text="Preview"
          justify="center"
          Icon={<RightArrow width={23} fill="#fff" />}
          disabled={!address || !selectedAsset || !amount}
          onClick={() => handleClick(address && selectedAsset && amount)}
        />
      </BottomSection>

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

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
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
