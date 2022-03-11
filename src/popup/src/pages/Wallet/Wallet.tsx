import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from 'context/AccountContext';
import ChainItem from './ChainItem';
import { getAssets, getNetworks, isValidPolkadotAddress } from 'utils/polkadot';
import NetworkItem from './NetworkItem';
import walletBG from 'assets/imgs/walletBG.jpg';
import { Link } from 'react-chrome-extension-router';
import Send from 'pages/Send/Send';
import Receive from 'pages/Recieve/Receive';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import keyring from '@polkadot/ui-keyring';
import { u8aToHex } from '@polkadot/util';
import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { decodePair } from '@polkadot/keyring/pair/decode';
import { base64Decode, encodeAddress as toSS58 } from '@polkadot/util-crypto';
import { createPair } from '@polkadot/keyring/pair';

type Props = {
  isMenuOpen?: boolean;
};

function Wallet({ isMenuOpen }: Props) {
  const account = useAccount();
  const dispatch = useDispatch();
  const [assets, setAssets] = useState<any>([]);
  const [networks, setNetworks] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [overallBalance, setOverallBalance] = useState<number | undefined>(undefined);

  const {
    prices,
    infos,
    accountsBalances,
    loading: accountsChanging
  } = useSelector((state: any) => state.wallet);

  const balances = accountsBalances?.balances;

  const handleActiveTab = (activeTab: number): void => {
    setActiveTab(activeTab);
  };

  const activeAccount = useCallback(account.getActiveAccount(), [account]);

  useEffect(() => {
    async function go() {
      const { overallBalance, assets }: any = await getAssets(prices, infos, balances);
      setAssets(assets);
      setOverallBalance(overallBalance);
    }

    if (activeAccount && balances) {
      go();
    }
  }, [activeAccount, balances]);

  useEffect(() => {
    const networks = getNetworks(prices, infos).filter((network) => network.symbol !== 'wnd');
    setNetworks(networks);
  }, [prices, infos]);

  return (
    <Container bg={walletBG}>
      <Header menuInitialOpenState={isMenuOpen} />
      <Content>
        <BalanceContainer>
          <span>Balance</span>
          <Balance>
            <span>
              {' '}
              $
              {(overallBalance || overallBalance === 0) && !accountsChanging
                ? new BigNumber(overallBalance).toFixed(2)
                : '...'}{' '}
            </span>
            {/* <DailyChange>+ 8.88%</DailyChange> */}
          </Balance>
        </BalanceContainer>
        <Buttons>
          <StyledLink component={Send}>
            <Button>Send</Button>
          </StyledLink>
          <StyledLink component={Receive}>
            <Button>Recieve</Button>
          </StyledLink>
        </Buttons>

        <List>
          <ListHeader>
            <ListHeaderItem onClick={() => handleActiveTab(1)} index={1} active={activeTab}>
              ASSETS
            </ListHeaderItem>
            <ListHeaderItem onClick={() => handleActiveTab(2)} index={2} active={activeTab}>
              NETWORKS
            </ListHeaderItem>
          </ListHeader>
          <ListContentParent>
            {accountsChanging ? (
              'Loading...'
            ) : (
              <ListContentChild>
                {activeTab === 1
                  ? assets.length > 0 &&
                    assets.map((asset: any) => {
                      return (
                        <ChainItem
                          key={asset.chain}
                          asset={asset}
                          accountAddress={account.getActiveAccount()?.address}
                        />
                      );
                    })
                  : networks &&
                    networks.map((network: any) => {
                      return <NetworkItem key={network.chain} network={network} />;
                    })}
              </ListContentChild>
            )}
          </ListContentParent>
        </List>
      </Content>
      <Footer activeItem="wallet" />
    </Container>
  );
}

export default memo(Wallet);

const Container = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  box-sizing: border-box;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-top: 50px;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
`;

const BalanceContainer = styled.div`
  text-align: left;
  margin-top: 30px;
  font-family: 'Sequel100Wide55Wide';
  span {
    font-size: 10px;
  }
`;

const Balance = styled.div`
  display: flex;
  span {
    font-size: 29px;
  }
`;

const DailyChange = styled.div`
  font-size: 14px;
  margin-left: 10px;
  color: #62c660;
`;

const Buttons = styled.div`
  display: flex;
  color: #fff;
  margin-top: 30px;
  font-family: 'Sequel100Wide55Wide';
`;

const Button = styled.div`
  width: 112px;
  height: 37px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  :nth-child(2) {
    margin-left: 10px;
  }
`;

const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const ListHeader = styled.div`
  display: flex;
  font-size: 10px;
`;

const ListHeaderItem = styled.div<{ index: number; active: number }>`
  cursor: pointer;
  font-family: 'Sequel100Wide55Wide';
  cursor: pointer;
  color: ${({ index, active }) => (index === active ? '#111' : '#8C8C8C')};
  :nth-child(2) {
    margin-left: 10px;
  }
`;

const ListContentParent = styled.div`
  width: 100%;
  height: 270px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  overflow-y: hidden;
  position: relative;
`;

const ListContentChild = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0px;
  bottom: -20px;
  right: -20px;
  overflow: scroll;
  padding-bottom: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  :nth-child(2) {
    margin-left: 10px;
  }
`;
