import Header from 'pages/Wallet/Header';
import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Wallet from 'pages/Wallet/Wallet';
import HumbleInput from 'components/primitives/HumbleInput';
import { Dispatch, useEffect, useState } from 'react';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { Asset } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  assets: Asset[];
  selectedAsset: Asset | undefined;
  setSelectedAsset: (asset: Asset) => void;
};

export default function SelectAsset({ assets, selectedAsset, setSelectedAsset }: Props) {
  const account = useAccount();
  const { nextStep } = useWizard();
  const history = useHistory();

  const [assetsFilter, setAssetsFilter] = useState<string>('');

  const handleClick = (asset: Asset) => {
    setSelectedAsset(asset);
    nextStep();
  };

  const renderAssets = (assets: Asset[], assetsFilter: string) => {
    return assets.filter((asset) => asset.name.toLowerCase().includes(assetsFilter.toLowerCase()));
  };

  return (
    <Container bg={walletBG}>
      <Header title="SELECT ASSET" backAction={() => history.push(router.home)} />
      <Content>
        <HumbleInput
          id="id"
          type="text"
          value={assetsFilter}
          onChange={(e: any) => {
            setAssetsFilter(e.target.value);
          }}
          bgColor={'#ececec'}
          borderColor={'#ececec'}
          placeholder="search"
          height="38.9px"
          marginTop="20px"
        />
        <List>
          {assets
            ? assets.length === 0
              ? 'no assets'
              : renderAssets(assets, assetsFilter).map((asset: Asset) => {
                  return (
                    <ChainItemContainer key={asset.symbol}>
                      <ChainItem
                        handleClick={() => handleClick(asset)}
                        asset={asset}
                        accountAddress={account.getActiveAccount()?.address}
                      />
                    </ChainItemContainer>
                  );
                })
            : 'Loading...'}
        </List>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-size: cover;
  padding-top: 110px;
`;

const Content = styled.div`
  padding: 15px;
`;

const List = styled.div`
  margin-top: 24px;
  height: 400px;
  overflow: scroll;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

const ChainItemContainer = styled.div`
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  color: #111;
`;
