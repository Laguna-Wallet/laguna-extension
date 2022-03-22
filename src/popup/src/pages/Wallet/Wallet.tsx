import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from 'context/AccountContext';
import ChainItem from './ChainItem';
import { addAccountMeta, getAssets, getNetworks, isValidPolkadotAddress } from 'utils/polkadot';
import NetworkItem from './NetworkItem';
import dashboardBG from 'assets/imgs/dashboard-bg.png';
import { goTo, Link } from 'react-chrome-extension-router';
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
import RightArrow from 'assets/svgComponents/RightArrow';
import BarcodeIcon from 'assets/svgComponents/BarcodeIcon';
import Snackbar from 'components/Snackbar/Snackbar';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';

export interface ShowSnackbar {
  message: string;
  show: boolean;
}

type Props = {
  isMenuOpen?: boolean;
  snackbar?: ShowSnackbar;
};

function Wallet({ isMenuOpen, snackbar }: Props) {
  const account = useAccount();
  const dispatch = useDispatch();
  const [assets, setAssets] = useState<any>([]);
  const [networks, setNetworks] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [overallBalance, setOverallBalance] = useState<number | undefined>(undefined);
  const hasViewedDashboard = account?.getActiveAccount()?.meta?.hasViewedDashboard;
  const currentAccountAddress = account?.getActiveAccount()?.address;
  const activeAccount = useCallback(account.getActiveAccount(), [account]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

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

  useEffect(() => {
    if (snackbar?.show) {
      setTimeout(() => {
        setIsSnackbarOpen(true);
        setSnackbarMessage(snackbar.message);
      }, 400);
    }
  }, []);

  // snackbarMessage
  // useEffect(() => {
  //   if (!hasViewedDashboard) {
  //     addAccountMeta(currentAccountAddress, { hasViewedDashboard: true });
  //     account.saveActiveAccount(currentAccountAddress);
  //   }
  // }, []);

  return (
    <Container bg={dashboardBG}>
      <Header menuInitialOpenState={isMenuOpen} />
      <Content>
        {/* {!true ? (
          <FirstTimeUserBalance>
            <h6>welcome, to get started</h6>
            <h2>Deposit your first asset!</h2>
            <StyledLink component={Receive}>
              <Button>
                <BarcodeIconContainer>
                  <BarcodeIcon />
                </BarcodeIconContainer>
                <span>Recieve</span>
              </Button>
            </StyledLink>
          </FirstTimeUserBalance>
        ) : ( */}
        <>
          <BalanceContainer>
            {/* <span>Balance</span> */}
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
              <Button>
                <RightArrowContainer>
                  <RightArrow width={20} height={20} stroke="#111" />
                </RightArrowContainer>
                <span>Send</span>
              </Button>
            </StyledLink>
            <StyledLink component={Receive}>
              <Button>
                <BarcodeIconContainer>
                  <BarcodeIcon />
                </BarcodeIconContainer>
                <span>Recieve</span>
              </Button>
            </StyledLink>
          </Buttons>
        </>
        {/* )} */}
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
                          handleClick={() => {
                            goTo(TokenDashboard, { asset });
                          }}
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
        <Snackbar
          width="194.9px"
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={snackbarMessage}
          type="success"
          // left="110px"
          bottom="70px"
        />
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0 15px 15px 15px;
`;

const FirstTimeUserBalance = styled.div`
  width: 100%;
  margin-top: 59px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h6 {
    font-family: Inter;
    font-size: 11px;
    margin-bottom: 10px;
    font-weight: 500;
  }

  h2 {
    font-family: 'IBM Plex Sans';
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 500;
  }
`;

const BalanceContainer = styled.div`
  text-align: center;
  margin-top: 59px;
  font-size: 44px;
  font-weight: 500;
  span {
    font-size: 10px;
  }
`;

const Balance = styled.div`
  display: flex;
  justify-content: center;
  span {
    font-family: 'IBM Plex Sans';
    font-size: 44px;
    font-weight: 500;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  color: #fff;
  margin-top: 30px;
`;

const RightArrowContainer = styled.div`
  transform: rotate(-45deg);
  margin-top: 3px;
`;

const BarcodeIconContainer = styled.div`
  margin-top: 3px;
  margin-right: 5px;
`;

const Button = styled.div`
  width: 112px;
  height: 37px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  background: #ffffff;
  color: #111;
  cursor: pointer;
  :nth-child(2) {
    margin-left: 10px;
  }
`;

const List = styled.div`
  width: 323px;
  display: flex;
  flex-direction: column;
  margin-top: 75px;
`;

const ListHeader = styled.div`
  display: flex;
  font-size: 10px;
`;

const ListHeaderItem = styled.div<{ index: number; active: number }>`
  cursor: pointer;
  font-family: Inter;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: 0.96px;
  text-align: left;
  color: ${({ index, active }) => (index === active ? '#18191a' : '#b1b5c3')};
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
  overflow-y: scroll;
  position: absolute;
  top: 0;
  left: 0px;
  bottom: -20px;
  right: -20px;
  overflow: scroll;
  padding-bottom: 80px;
  padding-right: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  :nth-child(2) {
    margin-left: 10px;
  }
`;
