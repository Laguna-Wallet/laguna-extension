import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import { Asset } from 'utils/types';
import { Wizard } from 'react-use-wizard';
import SelectAsset from './SelectAsset';
import { useEffect, useState } from 'react';
import ReceiveToken from './ReceiveToken';
import { accountsTie, getApiInstance, getAssets, recodeAddress } from 'utils/polkadot';
import { useSelector } from 'react-redux';

export default function Receive() {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const [assets, setAssets] = useState<Asset[]>([]);

  const { prices, infos } = useSelector((state: any) => state.wallet);

  const { accountsBalances } = useSelector((state: any) => state.wallet);
  // todo proper typing
  const currentAccountBalance =
    accountsBalances &&
    accountsBalances.find(
      (balances: any) => balances.address === account.getActiveAccount().address
    );

  // TODO REFETCH NETWORKS FROM STORAGE
  useEffect(() => {
    async function go() {
      const { assets }: any = await getAssets(prices, infos, currentAccountBalance);
      console.log('~ assets', assets);
      setAssets(assets);
    }

    go();
  }, []);

  const [selectedAsset, setSelectedAsset] = useState<Asset>();
  const [recoded, setRecoded] = useState<string>('');
  useEffect(() => {
    async function go() {
      if (!selectedAsset) return;
      const api = await getApiInstance(selectedAsset.chain);
      const genesisHash = api.genesisHash;

      // maybe not needed.
      accountsTie({ address: account.getActiveAccount().address, genesisHash });

      const prefix = api.consts.system.ss58Prefix;
      const recoded = recodeAddress(activeAccount.address, prefix);
      setRecoded(recoded);
    }
    go();
  }, [selectedAsset]);

  return (
    <Container>
      <Wizard>
        <SelectAsset
          assets={assets}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
        <ReceiveToken recoded={recoded} selectedAsset={selectedAsset} />
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
