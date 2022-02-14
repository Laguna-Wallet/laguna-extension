import { useState } from 'react';
import styled from 'styled-components';

import Header from 'pages/Wallet/Header';
import walletBG from 'assets/imgs/walletBG.jpg';
import Wallet from 'pages/Wallet/Wallet';
import HumbleInput from 'components/primitives/HumbleInput';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { goTo } from 'react-chrome-extension-router';
import { Asset } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useDispatch } from 'react-redux';
import { selectAsset } from 'redux/actions';

type Props = {
  assets: undefined | Asset[];
};

export default function SelectAsset({ assets }: Props) {
  const account = useAccount();
  const dispatch = useDispatch();

  const { nextStep } = useWizard();
  const [assetsFilter, setAssetsFilter] = useState<string>('');

  const handleClick = (asset: Asset) => {
    dispatch(selectAsset(asset));
    nextStep();
  };

  const renderAssets = (assets: Asset[], assetsFilter: string) => {
    return assets.filter((asset) => asset.name.toLowerCase().includes(assetsFilter.toLowerCase()));
  };

  return (
    <Container bg={walletBG}>
      <Header title="SELECT ASSET" backAction={() => goTo(Wallet)} />
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
                    <ChainItemContainer onClick={() => handleClick(asset)} key={asset.symbol}>
                      <ChainItem
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
  background-image: ${({ bg }) => `url(${bg})`};
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
