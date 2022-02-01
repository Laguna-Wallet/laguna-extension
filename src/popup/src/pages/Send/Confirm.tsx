import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
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
import Send from './Send';
import SwipeAndConfirm from 'components/primitives/SwipeAndConfirm';
import TransactionSent from './TransactionSent';
import { goTo, Link } from 'react-chrome-extension-router';
import { useAccount } from 'context/AccountContext';
import { calculateSelectedTokenExchange, getApiInstance, recodeAddress } from 'utils/polkadot';
import { useWizard } from 'react-use-wizard';
import { memo, useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import Wallet from 'pages/Wallet/Wallet';
import { truncateString } from 'utils';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { setBlockHash } from 'redux/actions';

type Props = {
  fee: string;
  transfer: any;
};
function Confirm({ fee, transfer }: Props) {
  const account = useAccount();
  const reduxSendTokenState = useSelector((state: any) => state.sendToken);

  const form = useSelector((state: any) => state);

  console.count('rerender');
  console.log('~ stateiii', form);

  const dispatch = useDispatch();

  const { nextStep, previousStep } = useWizard();

  const total = calculateSelectedTokenExchange(
    reduxSendTokenState.amount,
    reduxSendTokenState.selectedAsset.price
  );

  const handleClick = async () => {
    const pair = keyring.getPair(account.getActiveAccount().address);

    // todo dynamic password
    pair.unlock('neodzeneodze');

    // todo proper typing
    // const api = await getApiInstance(reduxSendTokenState.selectedAsset.chain as string);
    // const prefix = api.consts.system.ss58Prefix;
    // const recoded = recodeAddress(reduxSendTokenState.address, prefix);

    // Todo Proper handling
    const unsub = await transfer
      .signAndSend(pair, ({ status }: any) => {
        if (status.isInBlock) {
          console.log(`Completed at block hash #${status.asInBlock.toString()}`);
          dispatch(setBlockHash(status.asInBlock.toString()));
          nextStep();
        } else {
          console.log(`Current status: ${status.type}`);
        }
      })
      .catch((error: any) => {
        console.log(':( transaction failed', error);
      });
  };

  return (
    <Container>
      <Header title="CONFIRM" backAction={() => previousStep()} />
      <Content>
        <Text>
          I want to <br />
          send{' '}
          <span>
            {reduxSendTokenState.amount} {reduxSendTokenState?.selectedToken}
          </span>{' '}
          {/* todo actual name of the wallet */}
          <br /> from <span>SkyWalker</span> <br /> to{' '}
          <span>{truncateString(reduxSendTokenState.address)}</span>
        </Text>

        <Info>
          <InfoItem>
            Fee ={' '}
            <span>
              {/* {new BigNumber(fee).div(new BigNumber(10).pow(10))}{' '} */}
              {new BigNumber(fee).toFixed(3) || '...'} {reduxSendTokenState.selectedAsset.symbol}
              ($
              {new BigNumber(
                calculateSelectedTokenExchange(
                  new BigNumber(fee).div(new BigNumber(10).pow(10)).toString(),
                  reduxSendTokenState?.selectedAsset?.price as number
                )
              ).toFixed(2)}
              )
            </span>
          </InfoItem>

          <InfoItem>
            Total = <span> ${total || total === 0 ? total : '...'}</span>
          </InfoItem>
        </Info>
      </Content>

      <BottomSection>
        <BalanceInfo>Remaining Balance: </BalanceInfo>
        <SwipeAndConfirm handleConfirm={() => handleClick()} />
      </BottomSection>
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
  margin-top: 50px;
`;

const Text = styled.span`
  font-family: Sequel100Wide55Wide;
  font-size: 26px;
  color: #7c7c7c;
  span {
    font-family: SFCompactDisplayRegular;
    font-size: 20px;
    font-weight: 600;
    color: #141414;
    overflow: hidden;
    width: 50px;
  }
`;

const BottomSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 15px;
  box-sizing: border-box;
  margin-top: auto;
`;

const BalanceInfo = styled.div`
  font-size: 13.4px;
  color: #0c0c0c;
`;

const Info = styled.div`
  display: flex;
  height: 72px;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  background-color: #f3f3f3;
  border-radius: 5px;
  padding: 0 15px;

  span {
    font-family: 'SFCompactDisplayRegular';
    font-size: 13.4px;
  }
`;

const InfoItem = styled.div`
  font-size: 13.4px;
  span {
    font-weight: 600;
  }
`;