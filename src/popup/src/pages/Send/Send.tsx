import react from "react";
import styled from "styled-components";
import SelectAsset from "./SelectAsset";
import Confirm from "./Confirm";
import {
  getApiInstance,
  getAssets,
  getNetworks,
  isValidPolkadotAddress,
  recodeAddress,
  recodeAddressForTransaction,
} from "utils/polkadot";
import { useEffect, useReducer, useState } from "react";
import { AccountMeta, Asset, Network, SelectType } from "utils/types";
import { useWizard, Wizard } from "react-use-wizard";
import TransactionSent from "./TransactionSent";
import SendToken from "./SendToken";
import { useAccount } from "context/AccountContext";
import { useFormik } from "formik";
import { isNumeric, sendTokenSchema } from "utils/validations";
import BigNumber from "bignumber.js";
import { useDispatch, useSelector } from "react-redux";
import { PropsFromTokenDashboard } from "pages/Recieve/Receive";
import { selectAsset } from "redux/actions";
import { State } from "redux/store";
import { useLocation } from "react-router-dom";

export enum SendAccountFlowEnum {
  SendToTrustedContact = "SendToTrustedContact",
  SendToAddress = "SendToAddress",
  SendToAccount = "SendToAccount",
  ScanQR = "ScanQR",
}

export type FlowValue =
  | SendAccountFlowEnum.ScanQR
  | SendAccountFlowEnum.SendToAccount
  | SendAccountFlowEnum.SendToAddress
  | SendAccountFlowEnum.SendToTrustedContact;

type Props = {
  initialIsContactsPopupOpen?: boolean;
};

type LocationState = {
  propsFromTokenDashboard?: PropsFromTokenDashboard;
};

function Send({ initialIsContactsPopupOpen }: Props) {
  const account = useAccount();
  const dispatch = useDispatch();

  const [flow, setFlow] = useState<FlowValue | undefined>(undefined);
  const [assets, setAssets] = useState<Asset[] | undefined>(undefined);
  const [accountMeta, setAccountMeta] = useState<AccountMeta>();

  const location = useLocation<LocationState>();
  const { propsFromTokenDashboard } = location?.state || {};

  const { prices, infos, accountsBalances, disabledTokens } = useSelector(
    (state: State) => state.wallet,
  );

  const balances = accountsBalances?.balances;

  // TODO REFETCH NETWORKS FROM STORAGE
  useEffect(() => {
    async function go() {
      const { assets }: any = await getAssets(prices, infos, balances, disabledTokens);
      setAssets(assets);
    }

    go();
  }, []);

  const [transfer, setTransfer] = useState<any>();
  const [fee, setFee] = useState<any>();
  const [amountToSend, setAmountToSend] = useState<string>("");
  const [recoded, setRecoded] = useState<string>("");
  const [loading, setLoading] = useState<any>();
  const [abilityToTransfer, setAbilityToTransfer] = useState<boolean>(true);
  const [blockHash, setBlockHash] = useState<string>("");

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

      const recoded = recodeAddress(
        form.address,
        prefix,
        reduxSendTokenState.selectedAsset.encodeType,
      );

      // const recoded = recodeAddressForTransaction(form.address, prefix);

      setRecoded(recoded);

      const transfer = await api.tx.balances.transfer(form.address, amount.toString());
      console.log(1);
      const { partialFee, weight } = await transfer.paymentInfo(recoded);
      // const info = await transfer.paymentInfo(recoded);
      console.log(2);
      const fees = new BigNumber(`${partialFee}`).multipliedBy(110).dividedBy(100);

      // todo check this
      const total = amount.plus(fees);
      // .plus(api.consts.balances.existentialDeposit.toString());

      api.disconnect();
      if (total.gt(new BigNumber(available))) {
        setAbilityToTransfer(false);
      } else {
        setAbilityToTransfer(true);
        setAmountToSend(amount.toString());
      }

      setFee(`${new BigNumber(partialFee.toString()).div(factor)}`);
      setTransfer(transfer);
      setLoading(false);
    }

    go();
  }, [reduxSendTokenState.selectedAsset, form?.address, form?.amount]);

  useEffect(() => {
    setLoading(true);
    setAbilityToTransfer(false);
  }, [form?.amount]);

  return (
    <Container>
      <Wizard>
        {!propsFromTokenDashboard?.fromTokenDashboard && <SelectAsset assets={assets} />}

        <SendToken
          flow={flow}
          setFlow={setFlow}
          fee={fee}
          setLoading={setLoading}
          loading={loading}
          abilityToTransfer={abilityToTransfer}
          setAbilityToTransfer={setAbilityToTransfer}
          propsFromTokenDashboard={propsFromTokenDashboard}
          accountMeta={accountMeta}
          setAccountMeta={setAccountMeta}
        />

        <Confirm
          setBlockHash={setBlockHash}
          amountToSend={amountToSend}
          recoded={recoded}
          fee={fee}
          transfer={transfer}
          flow={flow}
        />
        <TransactionSent blockHash={blockHash} />
      </Wizard>
    </Container>
  );
}

export default react.memo(Send);

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
