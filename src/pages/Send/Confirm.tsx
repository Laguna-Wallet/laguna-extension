import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Header from 'pages/Wallet/Header';
import SelectAsset from './SelectAsset';
import Select from 'components/primitives/Select';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import SharpIcon from 'assets/svgComponents/SharpIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';
import Send, { SendTokenFormikValues } from './Send';
import SwipeAndConfirm from 'components/primitives/SwipeAndConfirm';
import TransactionSent from './TransactionSent';
import { goTo, Link } from 'react-chrome-extension-router';
import { Formik, FormikProps } from 'formik';
import { useAccount } from 'context/AccountContext';
import { calculateSelectedTokenExchange, getApiInstance, recodeAddress } from 'utils/polkadot';
import { useWizard } from 'react-use-wizard';
import { useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import Wallet from 'pages/Wallet/Wallet';

type Props = {
  formik: FormikProps<SendTokenFormikValues>;
  fee: string;
  transfer: any;
};

export default function Confirm({ formik, fee, transfer }: Props) {
  const account = useAccount();
  const { nextStep } = useWizard();

  const total = calculateSelectedTokenExchange(
    formik.values.amount,
    formik.values?.selectedAsset?.price as number
  );

  const handleClick = async (formik: FormikProps<SendTokenFormikValues>) => {
    const pair = keyring.getPair(account.getActiveAccount().address);

    pair.unlock('neodzeneodze');

    // todo proper typing
    const api = await getApiInstance(formik?.values?.selectedAsset?.chain as string);
    const prefix = api.consts.system.ss58Prefix;
    const recoded = recodeAddress(formik.values.address, prefix);

    const txHash = await api.tx.balances
      .transfer(recoded, Number(formik.values.amount))
      .signAndSend(pair);

    nextStep();

    // const transfer = await api.tx.balances.transfer(formik.values.address, 0.1);

    // const unsub = await transfer
    //   .signAndSend(pair, ({ status }: any) => {
    //     if (status.isInBlock) {
    //       console.log(`Completed at block hash #${status.asInBlock.toString()}`);
    //     } else {
    //       console.log(`Current status: ${status.type}`);
    //     }
    //   })
    //   .catch((error: any) => {
    //     console.log(':( transaction failed', error);
    //   });
  };

  return (
    <Container>
      <Header title="CONFIRM" backAction={() => previousStep()} />
      <Content>
        <Text>
          I want to <br />
          send <span>{formik.values.amount} DOT</span> <br /> from <span>SkyWalker</span> <br /> to{' '}
          <span>{formik.values.address}</span>
        </Text>

        <Info>
          <InfoItem>
            Fee = <span>{fee} ($0.32)</span>
          </InfoItem>

          <InfoItem>
            Total = <span> ${total}</span>
          </InfoItem>
        </Info>
      </Content>

      <BottomSection>
        <BalanceInfo>
          Remaining Balance:{' '}
          {Number(formik.values.selectedAsset?.balance) - Number(formik.values.amount)}{' '}
          {formik.values.selectedAsset?.symbol}
        </BalanceInfo>
        {/* <SwipeAndConfirm /> */}

        <Button
          onClick={() => handleClick(formik)}
          text="Send"
          justify="center"
          Icon={<RightArrow width={23} fill="#fff" />}
        />
      </BottomSection>
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
  margin-top: 50px;
`;

const Text = styled.span`
  font-family: Sequel100Wide55Wide;
  font-size: 26px;
  color: #7c7c7c;
  span {
    font-family: SFCompactDisplayRegular;
    font-size: 20px;
    font-weight: 500;
    color: #141414;
    overflow-wrap: break-word;
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
function previousStep(): void {
  throw new Error('Function not implemented.');
}
