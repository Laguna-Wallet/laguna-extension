import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Header from 'pages/Wallet/Header';
import SelectAsset from './SelectAsset';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import SharpIcon from 'assets/svgComponents/SharpIcon';
import WalletIcon from 'assets/svgComponents/WalletIcon';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import Button from 'components/primitives/Button';
import RightArrow from 'assets/svgComponents/RightArrow';
import Confirm from './Confirm';
import { goTo, Link } from 'react-chrome-extension-router';
import {
  getApiInstance,
  getAssets,
  getNetworks,
  isValidPolkadotAddress,
  recodeAddress
} from 'utils/polkadot';
import { useEffect, useReducer, useState } from 'react';
import { Asset, Network, SelectType } from 'utils/types';
import { useWizard, Wizard } from 'react-use-wizard';
import TransactionSent from './TransactionSent';
import SendToken from './SendToken';
import { useAccount } from 'context/AccountContext';
import { useFormik } from 'formik';
import { isNumeric, sendTokenSchema } from 'utils/validations';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

type Props = {
  initialIsContactsPopupOpen?: boolean;
};

export default function Send({ initialIsContactsPopupOpen }: Props) {
  const account = useAccount();
  const [flow, setFlow] = useState<string | undefined>(undefined);
  const [assets, setAssets] = useState<Asset[] | undefined>(undefined);
  const { prices, infos } = useSelector((state: any) => state.wallet);

  const { accountsBalances } = useSelector((state: any) => state.wallet);

  const balances = accountsBalances?.balances;

  // TODO REFETCH NETWORKS FROM STORAGE
  useEffect(() => {
    async function go() {
      const { assets }: any = await getAssets(prices, infos, balances);
      setAssets(assets);
    }

    go();
  }, []);

  const [transfer, setTransfer] = useState<any>();
  const [fee, setFee] = useState<any>();
  const [loading, setLoading] = useState<any>();
  const [abilityToTransfer, setAbilityToTransfer] = useState<boolean>(true);

  const reduxSendTokenState = useSelector((state: any) => state.sendToken);
  const form = useSelector((state: any) => state?.form?.sendToken?.values);

  useEffect(() => {
    async function go() {
      if (
        !reduxSendTokenState.selectedAsset ||
        !isValidPolkadotAddress(form?.address) ||
        !form.amount
      )
        return;

      setLoading(true);
      const api = await getApiInstance(reduxSendTokenState.selectedAsset.chain);

      const factor = new BigNumber(10).pow(new BigNumber(api.registry.chainDecimals[0]));
      const amount = new BigNumber(form.amount).multipliedBy(factor);
      const balance = await api.derive.balances.all(account.getActiveAccount().address);
      const available = `${balance.availableBalance}`;
      const prefix = api.consts.system.ss58Prefix;

      const recoded = recodeAddress(form.address, prefix);

      const transfer = await api.tx.balances.transfer(form.address, amount.toString());

      const { partialFee, weight } = await transfer.paymentInfo(recoded);

      const fees = new BigNumber(`{partialFee}`).multipliedBy(110).dividedBy(100);

      const total = amount.plus(fees).plus(api.consts.balances.existentialDeposit.toNumber());

      if (total.gt(new BigNumber(available))) {
        console.error(`Cannot transfer ${total} with ${available}`);
        setAbilityToTransfer(false);
      } else {
        setAbilityToTransfer(true);
      }

      setFee(`${new BigNumber(partialFee.toNumber()).div(factor)}`);
      setTransfer(transfer);
      setLoading(false);
    }

    go();
  }, [reduxSendTokenState.selectedAsset, form?.address, form?.amount]);

  return (
    <Container>
      <Wizard>
        <SelectAsset assets={assets} />
        <SendToken
          flow={flow}
          setFlow={setFlow}
          fee={fee}
          loading={loading}
          abilityToTransfer={abilityToTransfer}
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
