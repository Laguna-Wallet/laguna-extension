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
import { Network } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useDispatch } from 'react-redux';
import { selectAsset } from 'redux/actions';
import NetworkItem from 'pages/Wallet/NetworkItem';
import LoopIcon from 'assets/svgComponents/loopIcon';

type Props = {
  networks: undefined | Network[];
  setSelectedNetwork: (network: Network) => void;
};

export default function SelectNetwork({ networks, setSelectedNetwork }: Props) {
  const account = useAccount();
  const dispatch = useDispatch();

  const { nextStep } = useWizard();
  const [networksFilter, setNetworksFilter] = useState<string>('');

  const handleClick = (network: Network) => {
    setSelectedNetwork(network);
    nextStep();
  };

  const renderNetworks = (assets: Network[], networksFilter: string) => {
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(networksFilter.toLowerCase())
    );
  };

  return (
    <Container>
      <Header
        title="SELECT NETWORK"
        bgColor="#f2f2f2"
        closeAction={() => {
          goTo(Wallet);
        }}
        backAction={() => goTo(Wallet)}
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
          marginTop="20px"
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
  padding-top: 110px;
`;

const Content = styled.div`
  padding: 15px;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
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
