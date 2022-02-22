import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import { Network } from 'utils/types';
import { Wizard } from 'react-use-wizard';
import { useEffect, useState } from 'react';
import ReceiveToken from './ReceiveToken';
import { accountsTie, getApiInstance, getAssets, getNetworks, recodeAddress } from 'utils/polkadot';
import { useSelector } from 'react-redux';
import SelectNetwork from './SelectNetwork';

export default function Receive() {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const [networks, setNetworks] = useState<Network[]>([]);

  const { prices, infos } = useSelector((state: any) => state.wallet);

  useEffect(() => {
    async function go() {
      const networks: Network[] = await getNetworks(prices, infos);

      setNetworks(networks);
    }

    go();
  }, []);

  const [selectedNetwork, setSelectedNetwork] = useState<Network>();
  const [recoded, setRecoded] = useState<string>('');
  useEffect(() => {
    async function go() {
      if (!selectedNetwork) return;
      const api = await getApiInstance(selectedNetwork.chain);
      const genesisHash = api.genesisHash;

      // maybe not needed.
      accountsTie({ address: account.getActiveAccount().address, genesisHash });

      const prefix = api.consts.system.ss58Prefix;
      const recoded = recodeAddress(activeAccount.address, prefix);
      setRecoded(recoded);
    }
    go();
  }, [selectedNetwork]);

  return (
    <Container>
      <Wizard>
        <SelectNetwork setSelectedNetwork={setSelectedNetwork} networks={networks} />
        <ReceiveToken recoded={recoded} selectedNetwork={selectedNetwork} />
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
  font-family: 'SFCompactDisplayRegular';
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  margin-top: auto;
  text-align: center;
`;
