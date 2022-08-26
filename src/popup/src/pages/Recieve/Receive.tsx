import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import { Asset, Network } from 'utils/types';
import { Wizard } from 'react-use-wizard';
import { useEffect, useState } from 'react';
import ReceiveToken from './ReceiveToken';
import { getNetworks, recodeAddress } from 'utils/polkadot';
import { useSelector } from 'react-redux';
import SelectNetwork from './SelectNetwork';
import { State } from 'redux/store';
import { useLocation } from 'react-router-dom';
export interface PropsFromTokenDashboard {
  fromTokenDashboard?: boolean;
  asset?: Asset;
  chain?: string;
}

type LocationState = {
  propsFromTokenDashboard?: PropsFromTokenDashboard;
};

export default function Receive() {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const { prices, infos, disabledTokens } = useSelector((state: State) => state.wallet);

  const location = useLocation<LocationState>();
  const { propsFromTokenDashboard } = location?.state || {};

  const [networks, setNetworks] = useState<any>(getNetworks(prices, infos, disabledTokens));
  const [selectedNetwork, setSelectedNetwork] = useState<Network & Asset>();

  const [recoded, setRecoded] = useState<string>('');

  useEffect(() => {
    async function go() {
      if (!selectedNetwork) return;
      // const api = await getApiInstance(selectedNetwork.chain);
      // const prefix = api.consts.system.ss58Prefix;
      const recoded = recodeAddress(
        activeAccount.address,
        selectedNetwork?.prefix,
        selectedNetwork?.encodeType
      );
      setRecoded(recoded);
    }
    go();
  }, [selectedNetwork]);

  useEffect(() => {
    if (propsFromTokenDashboard?.fromTokenDashboard) {
      const network = networks.find(
        (network: any) => network.chain === propsFromTokenDashboard.chain
      );
      setSelectedNetwork(network);
    }
  }, []);

  return (
    <Container>
      <Wizard>
        {!propsFromTokenDashboard?.fromTokenDashboard && (
          <SelectNetwork setSelectedNetwork={setSelectedNetwork} />
        )}

        <ReceiveToken
          propsFromTokenDashboard={propsFromTokenDashboard}
          recoded={recoded}
          selectedNetwork={selectedNetwork}
        />
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
  background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 35px;
  box-sizing: border-box;
`;

const QRContainer = styled.div`
  width: 226px;
  height: 227.23px;
`;

const ContentItem = styled.div`
  width: 100%;
  margin-top: 15px;
`;

const Text = styled.div`
  font-size: 14px;
  color: #8c8c8c;
  font-family: 'Sequel100Wide55Wide';
`;

const BottomText = styled.div`
  font-family: 'Inter';
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  margin-top: auto;
  text-align: center;
`;
