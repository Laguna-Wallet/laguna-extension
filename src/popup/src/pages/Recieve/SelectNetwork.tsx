import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Header from 'pages/Wallet/Header';
import HumbleInput from 'components/primitives/HumbleInput';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { Asset, Network } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useSelector } from 'react-redux';
import LoopIcon from 'assets/svgComponents/loopIcon';
import { State } from 'redux/store';
import { getAssets } from 'utils/polkadot';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  setSelectedNetwork: (network: Network & Asset) => void;
};

export default function SelectNetwork({ setSelectedNetwork }: Props) {
  const history = useHistory();
  const account = useAccount();
  const { nextStep } = useWizard();

  const accountAddress = account.getActiveAccount()?.address;
  const [assets, setAssets] = useState<(Asset[] & Network[]) | undefined>(undefined);
  const [networksFilter, setNetworksFilter] = useState<string>('');

  const { prices, infos, accountsBalances, disabledTokens } = useSelector(
    (state: State) => state.wallet
  );

  const balances = accountsBalances?.balances;

  useEffect(() => {
    async function go() {
      const { assets }: any = await getAssets(prices, infos, balances, disabledTokens, true);
      setAssets(assets);
    }

    go();
  }, []);

  const renderNetwork = (assets: Asset[] & Network[], networksFilter: string) => {
    return assets.filter((asset) =>
      asset.name.toLowerCase().includes(networksFilter.toLowerCase())
    );
  };

  const handleClick = (asset: Network & Asset) => {
    setSelectedNetwork(asset);
    nextStep();
  };

  const headerAction = () => history.push(router.home);

  return (
    <Container>
      <Header
        title="SELECT ASSET"
        bgColor="#f2f2f2"
        closeAction={headerAction}
        backAction={headerAction}
        stroke="#777E91"
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
          fontSize="14px"
          fontWeight="500"
          IconAlignment="left"
          Icon={<LoopIcon />}
        />

        <List>
          {assets
            ? assets.length === 0
              ? 'no assets'
              : renderNetwork(assets, networksFilter).map((asset: any) => {
                  return (
                    <ChainItemContainer key={asset.chain}>
                      <ChainItem
                        asset={asset}
                        iconSize="28px"
                        accountAddress={accountAddress}
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
