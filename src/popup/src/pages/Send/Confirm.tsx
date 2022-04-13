import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import loadingTransactionBg from 'assets/imgs/loading-transaction.png';
import Header from 'pages/Wallet/Header';
import SelectAsset from './SelectAsset';
import Select from 'pages/Send/TokenAndAmountSelect';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import SharpIcon from 'assets/svgComponents/SharpIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';
import Send, { FlowValue, SendAccountFlowEnum } from './Send';
import SwipeAndConfirm from 'components/primitives/SwipeAndConfirm';
import TransactionSent from './TransactionSent';
import { goTo, Link } from 'react-chrome-extension-router';
import { useAccount } from 'context/AccountContext';
import { useWizard } from 'react-use-wizard';
import { memo, useEffect, useState } from 'react';
import Wallet from 'pages/Wallet/Wallet';
import { getAccountNameByAddress, getContactNameByAddress, truncateString } from 'utils';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { Messages, SnackbarMessages } from 'utils/types';
import NetworkIcons from 'components/primitives/NetworkIcons';
import { reset } from 'redux-form';
import Popup from 'components/Popup/Popup';
import { ClassicSpinner } from 'react-spinners-kit';

type Props = {
  fee: string;
  transfer: any;
  amountToSend: string;
  recoded: string;
  setBlockHash: (blockHash: string) => void;
  flow: FlowValue | undefined;
};

function Confirm({ fee, transfer, amountToSend, recoded, setBlockHash, flow }: Props) {
  const { nextStep, previousStep } = useWizard();
  const account = useAccount();
  const dispatch = useDispatch();
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);

  const { address, amount, token } = useSelector((state: any) => state.form.sendToken.values);
  const selectedAsset = useSelector((state: any) => state.sendToken.selectedAsset);

  const { prices } = useSelector((state: any) => state.wallet);

  const price = prices[selectedAsset.chain.toLowerCase()]?.usd;

  const chain = selectedAsset?.chain;

  const total = new BigNumber(amount)
    .plus(fee)
    .times(price || 0)
    .toFormat(4);

  const activeAccountAddress = account?.getActiveAccount()?.address;
  const name = account?.getActiveAccount()?.meta?.name;

  const handleClick = async () => {
    chrome.runtime.sendMessage({
      type: Messages.SendTransaction,
      payload: {
        sendTo: recoded,
        sendFrom: activeAccountAddress,
        amount: amountToSend,
        chain
      }
    });

    setLoadingTransaction(true);
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === Messages.TransactionSuccess) {
        setBlockHash(msg.payload.block);
        setLoadingTransaction(false);
        setTransactionConfirmed(true);
        goTo(Wallet, { snackbar: { show: true, message: SnackbarMessages.TransactionSent } });
      }
    });
  }, []);

  const renderTotal = (total: string) => {
    if (!total) return '...';
    if (Number(total) === 0) return 0;
    return total;
  };

  const handleGetName = (flow: FlowValue | undefined) => {
    if (flow === SendAccountFlowEnum.SendToAccount) {
      return getAccountNameByAddress(recoded);
    } else if (flow === SendAccountFlowEnum.SendToTrustedContact) {
      return getContactNameByAddress(recoded);
    }

    return '';
  };

  const toName = handleGetName(flow);

  return (
    <Container>
      <Header
        title="CONFIRM"
        bgColor="#f2f2f2"
        closeAction={() => {
          dispatch(reset('sendToken'));
          goTo(Wallet);
        }}
        backAction={() => previousStep()}
      />
      <Content>
        <TextContainer>
          <Text>
            <NetworkIcons chain={chain} /> <span>I want to send</span>
          </Text>{' '}
          <Text>
            {amount} {token}
          </Text>{' '}
          <Text>
            <span>on the</span> <Tag>{chain} Network</Tag>
          </Text>
          <AddressesInfo>
            <AddressesInfoItem>
              <span>From</span>
              <span>
                {name?.length > 10 ? truncateString(name, 5) : name}(
                {truncateString(activeAccountAddress, 5)})
              </span>
            </AddressesInfoItem>
            <AddressesInfoItem>
              <span>To</span>

              <span>
                {toName && toName?.length > 10 ? truncateString(toName, 5) : toName}(
                {truncateString(recoded, 5)})
              </span>
            </AddressesInfoItem>
            <AddressesInfoItem>
              <span>Total</span>
              <span>
                {new BigNumber(fee).plus(amount).toFormat(4)} {token.toUpperCase()}
              </span>
            </AddressesInfoItem>
          </AddressesInfo>
          {/* <span>{name && name.length > 14 ? truncateString(name) : name}</span> <br /> to{' '}
          <span>{truncateString(address)}</span> */}
        </TextContainer>
      </Content>

      <Info>
        <InfoItem>
          <span>USD AMOUNT</span>
          <span> ${renderTotal(total)}</span>
        </InfoItem>

        <InfoItem>
          <span>Fee</span>
          <span>
            {new BigNumber(fee).toFormat(4) + ` ${token.toUpperCase()}`}
            (${new BigNumber(fee).times(price || 0).toFormat(4)})
          </span>
        </InfoItem>
      </Info>

      <BottomSection>
        <Button
          onClick={() => {
            goTo(Wallet);
            dispatch(reset('sendToken'));
          }}
          text="Cancel"
          color="#111"
          bgColor="#ececec"
          borderColor="#ececec"
          justify="center"
          margin="10px 10px 0  0"
        />
        <Button
          onClick={() => {
            handleClick();
          }}
          text="Send"
          color="#fff"
          bgColor="#111"
          borderColor="#111"
          justify="center"
          margin="10px 0 0 0"
        />
      </BottomSection>

      {loadingTransaction && (
        <Popup justify="center" align="center" onClose={() => undefined}>
          <LoadingContainer bg={loadingTransactionBg}>
            <ClassicSpinner size={60} color="#fff" loading={true} />
          </LoadingContainer>
        </Popup>
      )}
    </Container>
  );
}

export default memo(Confirm);

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
  margin-top: 15px;
`;

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: Inter;
  font-size: 18px;
  line-height: 1.35;
  color: #18191a;
  text-align: center;
`;
const Text = styled.div`
  :nth-child(1) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :nth-child(2) {
    font-family: 'Work Sans';
    font-size: 27px;
    font-weight: 600;
    color: #18191a;
    text-transform: uppercase;
  }

  :nth-child(3) {
    display: flex;
    justify-content: center;
  }

  span {
    margin-left: 5px;
  }
`;

const AddressesInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

const AddressesInfoItem = styled.div`
  width: 100%;
  height: 48px;
  border-radius: 4.1px;
  background-color: #f3f3f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
  font-family: Inter;
  font-size: 16px;
  color: #000000;
  margin-bottom: 12px;
  span:nth-child(1) {
    font-weight: 600;
    color: #141414;
  }

  :last-child {
    font-weight: 600;
  }
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: auto;
`;

const Tag = styled.div`
  width: 97px;
  height: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 60px;
  font-family: 'IBM Plex Sans';
  font-size: 10px;
  color: #000;
  margin-left: 5px;
  background: linear-gradient(
    243.63deg,
    #f5decc 25.2%,
    #f2d2db 60.93%,
    #d7cce2 101.49%,
    #c7dfe4 142.05%,
    #edf1e1 178.75%,
    #ffffff 210.61%
  );
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 32px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Inter;
  font-size: 14px;
  color: #18191a;
  margin-top: 5px;
`;

const LoadingContainer = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
`;
