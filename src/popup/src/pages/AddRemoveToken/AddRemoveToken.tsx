import { useState } from 'react';
import styled from 'styled-components';
import { reset } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';

import { useAccount } from 'context/AccountContext';

import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import HumbleInput from 'components/primitives/HumbleInput';

import { goTo } from 'react-chrome-extension-router';
import { getNetworks } from 'utils/polkadot';

import { Network } from 'utils/types';

import SearchIcon from 'assets/svgComponents/SearchIcon';
import TokenItem from './TokenItem';
import LoopIcon from 'assets/svgComponents/loopIcon';

export default function AddRemoveToken() {
  const dispatch = useDispatch();

  const {
    prices,
    infos,
    accountsBalances: { balances },
    disabledTokens
  } = useSelector((state: any) => state.wallet);

  const [networks, setNetworks] = useState<Network[]>(getNetworks(prices, infos));

  const [networksFilter, setNetworksFilter] = useState<string>('');

  const renderNetworks = (networks: Network[], networksFilter: string) => {
    return networks.filter(
      (network) =>
        network.name.toLowerCase().includes(networksFilter?.toLowerCase()) ||
        network.chain.toLowerCase().includes(networksFilter?.toLowerCase())
    );
  };

  return (
    <Container>
      <Header
        title="ADD / REMOVE TOKENS"
        closeAction={() => {
          goTo(Wallet);
        }}
        backAction={() => {
          goTo(Wallet);
        }}
        bgColor="#f2f2f2"
      />
      <Content>
        <HumbleInput
          id="id"
          type="text"
          value={networksFilter}
          onChange={(e: any) => {
            setNetworksFilter(e.target.value);
          }}
          bgColor={'#f2f2f2'}
          borderColor={'#f2f2f2'}
          placeholderColor="#777e90"
          color="#777e90"
          placeholder="Search"
          height="45px"
          marginTop="20px"
          IconAlignment="left"
          Icon={<LoopIcon />}
        />
        <List>
          {networks
            ? networks?.length === 0
              ? 'no assets'
              : renderNetworks(networks, networksFilter).map((network: Network, index: number) => {
                  return (
                    <TokenItem
                      key={`${network?.chain}-${index}`}
                      network={network}
                      balance={balances[network?.chain]}
                    />
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
  background-size: cover;
  padding-top: 110px;
`;

const Content = styled.div`
  height: 100%;
  padding: 15px;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  background-color: #fff;
`;

const List = styled.div`
  margin-top: 24px;
  /* overflow: scroll; */
  padding-bottom: 20px;
  box-sizing: border-box;
`;
