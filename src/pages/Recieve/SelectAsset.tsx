import Header from 'pages/Wallet/Header';
import styled from 'styled-components';
import walletBG from 'assets/imgs/walletBG.jpg';
import Wallet from 'pages/Wallet/Wallet';
import HumbleInput from 'components/primitives/HumbleInput';
import { Dispatch, useEffect, useState } from 'react';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { getAssets } from 'utils/polkadot';
import { goTo, Link } from 'react-chrome-extension-router';
import { Asset } from 'utils/types';
import { useWizard } from 'react-use-wizard';

type Props = {
  assets: Asset[];
  selectedAsset: Asset | undefined;
  setSelectedAsset: (asset: Asset) => void;
};

export default function SelectAsset({ assets, selectedAsset, setSelectedAsset }: Props) {
  const account = useAccount();
  const { nextStep } = useWizard();

  const handleClick = (asset: Asset) => {
    setSelectedAsset(asset);
    nextStep();
  };

  return (
    <Container bg={walletBG}>
      <Header title="SELECT ASSET" backAction={() => goTo(Wallet)} />
      <Content>
        <HumbleInput
          id="id"
          type="text"
          value={''}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            console.log('ura');
          }}
          bgColor={'#ececec'}
          borderColor={'#ececec'}
          placeholder="search"
          height="38.9px"
          marginTop="20px"
        />
        <List>
          {assets &&
            assets.map((asset: Asset) => {
              return (
                <ChainItemContainer onClick={() => handleClick(asset)} key={asset.symbol}>
                  <ChainItem asset={asset} accountAddress={account.getActiveAccount()?.address} />
                </ChainItemContainer>
              );
            })}
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
`;

const ChainItemContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  text-decoration: none;
  color: #111;
`;
