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
import SearchIcon from 'assets/svgComponents/SearchIcon';
import { reset } from 'redux-form';

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
    <Container>
      <Header
        title="SELECT ASSET"
        closeAction={() => {
          dispatch(reset('sendToken'));
          goTo(Wallet);
        }}
        backAction={() => {
          goTo(Wallet);
          dispatch(reset('sendToken'));
        }}
        bgColor="#f2f2f2"
      />
      <Content>
        <HumbleInput
          id="id"
          type="text"
          value={assetsFilter}
          onChange={(e: any) => {
            setAssetsFilter(e.target.value);
          }}
          bgColor={'#f2f2f2'}
          borderColor={'#f2f2f2'}
          placeholder="Search"
          height="45px"
          marginTop="20px"
          color="#777e90"
          Icon={<SearchIcon />}
        />
        <List>
          {assets
            ? assets.length === 0
              ? 'no assets'
              : renderAssets(assets, assetsFilter).map((asset: Asset) => {
                  return (
                    <ChainItemContainer key={asset.symbol}>
                      <ChainItem
                        asset={asset}
                        accountAddress={account.getActiveAccount()?.address}
                        handleClick={() => handleClick(asset)}
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-size: cover;
  padding-top: 110px;
`;

const Content = styled.div`
  padding: 15px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  background-color: #fff;
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
