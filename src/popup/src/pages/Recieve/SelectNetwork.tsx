import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Header from 'pages/Wallet/Header';
import walletBG from 'assets/imgs/walletBG.jpg';
import Wallet from 'pages/Wallet/Wallet';
import HumbleInput from 'components/primitives/HumbleInput';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { goTo } from 'react-chrome-extension-router';
import { Network } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useDispatch } from 'react-redux';
import { selectAsset } from 'redux/actions';
import NetworkItem from 'pages/Wallet/NetworkItem';
import LoopIcon from 'assets/svgComponents/loopIcon';

type Props = {
  networks: Network[];
  setSelectedNetwork: (network: Network) => void;
};

export default function SelectNetwork({ networks, setSelectedNetwork }: Props) {
  const { nextStep } = useWizard();
  const account = useAccount();
  const dispatch = useDispatch();

  const [networksFilter, setNetworksFilter] = useState<string>('');

  const handleClick = (network: Network) => {
    setSelectedNetwork(network);
    nextStep();
  };

  const renderNetworks = (networks: Network[], networksFilter: string) => {
    return networks.filter((network) =>
      network.name.toLowerCase().includes(networksFilter.toLowerCase())
    );
  };

  return (
    <Container>
      <Header
        title="SELECT ASSET"
        bgColor="#f2f2f2"
        closeAction={() => {
          goTo(Wallet);
        }}
        backAction={() => goTo(Wallet)}
        stroke= '#777E91'
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
          color="#777e90"
          placeholderColor="#777e90"
          placeholder="Search"
          height="45px"
          marginTop="0"
          fontSize='14px'
          fontWeight='500'
          IconAlignment='left'
          Icon={<LoopIcon />}
        />
        <List>
          {networks
            ? networks.length === 0
              ? 'no assets'
              : renderNetworks(networks, networksFilter).map((network: Network) => {
                  return (
                    <ChainItemContainer onClick={() => handleClick(network)} key={network.symbol}>
                      <NetworkItem network={network} />
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
  padding-top: 92px;
`;

const Content = styled.div`
  height: 100%;
  padding: 20px 26px;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const List = styled.div`
  margin-top: 12px;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

const ChainItemContainer = styled.div`
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  color: #111;
`;
