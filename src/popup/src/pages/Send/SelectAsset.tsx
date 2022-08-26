import { useState } from 'react';
import styled from 'styled-components';

import Header from 'pages/Wallet/Header';
import HumbleInput from 'components/primitives/HumbleInput';
// Todo Move ChainItem Into Shared
import ChainItem from '../../pages/Wallet/ChainItem';
import { useAccount } from 'context/AccountContext';
import { Asset } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { useDispatch } from 'react-redux';
import { selectAsset } from 'redux/actions';
import { reset } from 'redux-form';
import LoopIcon from 'assets/svgComponents/loopIcon';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  assets: undefined | Asset[];
};

export default function SelectAsset({ assets }: Props) {
  const history = useHistory();
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

  const headerAction = () => {
    dispatch(reset('sendToken'));
    history.push(router.home);
  };

  return (
    <Container>
      <Header
        title="SELECT ASSET"
        closeAction={headerAction}
        backAction={headerAction}
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
          color="#777e90"
          placeholderColor="#777e90"
          placeholder="Search"
          height="45px"
          IconAlignment="left"
          Icon={<LoopIcon />}
        />
        <List>
          {assets
            ? assets.length === 0
              ? 'no assets'
              : renderAssets(assets, assetsFilter).map((asset: Asset) => {
                  return (
                    <ChainItemContainer key={asset.symbol}>
                      <ChainItem
                        iconSize="28px"
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
  padding-top: 92px;
`;

const Content = styled.div`
  height: 100%;
  padding: 20px 26px;
  border-radius: 10px 10px 0px 0px;
  background-color: #fff;
`;

const List = styled.div`
  margin-top: 12px;
  box-sizing: border-box;
`;

const ChainItemContainer = styled.div`
  width: 100%;
  cursor: pointer;
  text-decoration: none;
  color: #111;
`;
