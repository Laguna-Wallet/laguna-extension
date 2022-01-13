import styled from 'styled-components';
import { useAccount } from 'context/AccountContext';
import { Asset } from 'utils/types';
import { Wizard } from 'react-use-wizard';
import SelectAsset from './SelectAsset';
import { useEffect, useState } from 'react';
import RecieveToken from './RecieveToken';
import { accountsTie, getApiInstance, recodeAddress } from 'utils/polkadot';

export default function Receive() {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const [assets, setAssets] = useState<Asset[]>([
    {
      balance: '0.0100',
      calculatedPrice: 0,
      chain: 'westend',
      name: 'Polkadot',
      price: 0,
      symbol: 'wnd'
    },
    {
      balance: '1.0000',
      calculatedPrice: 29.63,
      chain: 'polkadot',
      name: 'Polkadot',
      price: 29.63,
      symbol: 'dot'
    },
    {
      balance: '1.0000',
      calculatedPrice: 29.63,
      chain: 'kusama',
      name: 'Kusama',
      price: 29.63,
      symbol: 'ksm'
    }
  ]);

  // useEffect(() => {
  //   async function go() {
  //     // TODO proper typing
  //     const { assets }: any = await getAssets(activeAccount?.address);
  //     setAssets(assets);
  //     setSelectedAsset(assets[0]);
  //   }

  //   if (activeAccount) {
  //     go();
  //   }
  // }, [account.getActiveAccount()]);
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
        <RecieveToken recoded={recoded} selectedAsset={selectedAsset} />
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
