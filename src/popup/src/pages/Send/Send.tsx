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
import Confirm from './Confirm';
import { goTo, Link } from 'react-chrome-extension-router';
import { getApiInstance, getAssets, getNetworks } from 'utils/polkadot';
import { useEffect, useReducer, useState } from 'react';
import { Asset, Network, SelectType } from 'utils/types';
import { useWizard, Wizard } from 'react-use-wizard';
import TransactionSent from './TransactionSent';
import SendToken from './SendToken';
import { useAccount } from 'context/AccountContext';
import { useFormik } from 'formik';
import { sendTokenSchema } from 'utils/validations';
import Wallet from 'pages/Wallet/Wallet';
import keyring from '@polkadot/ui-keyring';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

// Todo get rid of useReducer cause redux has been introduced in the application
export type SendTokenState = {
  assets: any;
  selectedAsset: any;
  amount: string;
};

export interface SendTokenFormikValues {
  amount: string;
  selectedAsset: Asset | undefined;
  address: string;
  note: string;
}

export enum SendTokenActionsEnum {
  SELECT_ASSET = 'SELECT_ASSET',
  SET_ASSETS = 'SET_ASSETS',
  SET_AMOUNT = 'SET_AMOUNT'
}

export type SendTokenActions =
  | { type: SendTokenActionsEnum.SELECT_ASSET; payload: Asset }
  | { type: SendTokenActionsEnum.SET_ASSETS; payload: Asset[] }
  | { type: SendTokenActionsEnum.SET_AMOUNT; payload: string };

type Props = {
  initialIsContactsPopupOpen?: boolean;
};

export default function Send({ initialIsContactsPopupOpen }: Props) {
  const account = useAccount();
  const [flow, setFlow] = useState<string | undefined>(undefined);

  const { prices, infos } = useSelector((state: any) => state.wallet);

  // TODO Revise maybe useReducer is not needed or maybe stick to it and remove Formik
  function reducer(state: SendTokenState, action: SendTokenActions): SendTokenState {
    switch (action.type) {
      case SendTokenActionsEnum.SET_ASSETS:
        return { ...state, assets: action.payload };
      case SendTokenActionsEnum.SELECT_ASSET:
        return { ...state, selectedAsset: action.payload };
      case SendTokenActionsEnum.SET_AMOUNT:
        return { ...state, amount: action.payload };
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    selectedAsset: undefined,
    amount: '',
    // assets: undefined
    assets: [
      {
        balance: '1.7781',
        calculatedPrice: 0,
        chain: 'westend',
        name: 'Polkadot',
        price: 0,
        symbol: 'wnd'
      },
      {
        balance: '1.2252',
        calculatedPrice: 31.181340000000002,
        chain: 'polkadot',
        name: 'Polkadot',
        price: 25.45,
        symbol: 'dot'
      },
      {
        balance: '0.0297',
        calculatedPrice: 7.562511,
        chain: 'kusama',
        name: 'Kusama',
        price: 254.63,
        symbol: 'ksm',
        amount: ''
      }
    ]
  });

  // TODO REFETCH NETWORKS FROM STORAGE
  useEffect(() => {
    async function go() {
      const { assets } = await getAssets(account.getActiveAccount()?.address, prices, infos);

      dispatch({ type: SendTokenActionsEnum.SET_ASSETS, payload: assets });

      if (!state.selectedAsset) {
        dispatch({ type: SendTokenActionsEnum.SELECT_ASSET, payload: assets[0] });
        formik.setFieldValue('selectedAsset', assets[0]);
      }
    }

    go();
  }, []);

  const formik = useFormik<SendTokenFormikValues>({
    initialValues: {
      amount: '',
      selectedAsset: undefined,
      address: '',
      note: ''
    },
    validationSchema: sendTokenSchema,
    onSubmit: (values) => {
      // account.setPassword(values.password);
      // nextStep();
    }
  });

  const [transfer, setTransfer] = useState<any>();
  const [fee, setFee] = useState<any>();
  const [loading, setLoading] = useState<any>();

  const reduxSendTokenState = useSelector((state: any) => state.sendToken);

  useEffect(() => {
    async function go() {
      if (!reduxSendTokenState.selectedAsset || !reduxSendTokenState.address) return;

      setLoading(true);
      const api = await getApiInstance(reduxSendTokenState.selectedAsset.chain);

      const factor = new BigNumber(10).pow(new BigNumber(api.registry.chainDecimals[0]));
      const amount = new BigNumber(reduxSendTokenState.amount).multipliedBy(factor);

      const balance = await api.derive.balances.all(account.getActiveAccount().address);
      const available = balance.availableBalance.toNumber();

      const transfer = await api.tx.balances.transfer(
        reduxSendTokenState.address,
        amount.toNumber()
      );

      const { partialFee, weight } = await transfer.paymentInfo(reduxSendTokenState.address);

      const fees = partialFee.muln(110).divn(100);

      const total = amount
        .plus(fees.toNumber())
        .plus(api.consts.balances.existentialDeposit.toNumber());

      if (total.gt(available)) {
        console.error(`Cannot transfer ${total} with ${available}`);
      }

      setFee(`${new BigNumber(partialFee.toNumber()).div(factor)}`);
      setTransfer(transfer);
      setLoading(false);
    }

    go();
  }, [reduxSendTokenState.selectedAsset, reduxSendTokenState.address, reduxSendTokenState.amount]);

  return (
    <Container>
      <Wizard>
        <SelectAsset state={state} />
        <SendToken
          formik={formik}
          flow={flow}
          setFlow={setFlow}
          state={state}
          dispatch={dispatch}
          fee={fee}
          loading={loading}
        />
        <Confirm fee={fee} transfer={transfer} />
        <TransactionSent />
      </Wizard>
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
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
`;
