import { memo, ReactNode, useCallback, useEffect, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from 'context/AccountContext';
import ChainItem from './ChainItem';
import { getAssets } from 'utils/polkadot';
import NetworkItem from './NetworkItem';
import dashboardBG from 'assets/imgs/dashboard-bg.png';
import { goTo, Link } from 'react-chrome-extension-router';
import Send from 'pages/Send/Send';
import Receive from 'pages/Recieve/Receive';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from 'components/Snackbar/Snackbar';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import ReceiveIcon from 'assets/svgComponents/ReceiveIcon';
import SendIcon from 'assets/svgComponents/SendIIcon';
import SwitchAssetsIcon from 'assets/svgComponents/SwitchAssetIcon';
import AddRemoveToken from 'pages/AddRemoveToken/AddRemoveToken';
import { State } from 'redux/store';
import SecureNowIcon from 'assets/svgComponents/SecureNowIcon';
import RightArrowMenuIcon from 'assets/svgComponents/MenuIcons/RightArrowMenuIcon';
import CreateAccount from 'pages/AddImportAccount/CreateAccount/CreateAccount';
import keyring from '@polkadot/ui-keyring';
import { StorageKeys } from 'utils/types';
import { toggleLoading } from 'redux/actions';
import { Asset } from 'utils/types';
import { getFromStorage, saveToStorage } from 'utils/chrome';

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
  const activeAccount = useCallback(account.getActiveAccount(), [account]);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [overallBalance, setOverallBalance] = useState<number | undefined>(undefined);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const accountBalances = useSelector((state: State) => state.wallet?.accountsBalances);
  const [overallPriceChange, setOverallPriceChange] = useState<number | undefined>(undefined);

  const negativeValue = String(overallPriceChange).includes('-');
  const dispatch = useDispatch();

  const {
    prices,
    infos,
    accountsBalances,
    loading: accountsChanging,
    disabledTokens
  } = useSelector((state: State) => state.wallet);

  const balances = accountsBalances?.balances;

  const handleActiveTab = (activeTab: number): void => {
    setActiveTab(activeTab);
  };

  useEffect(() => {
    async function go() {
      const { overallBalance, overallPriceChange, assets }: any = await getAssets(
        prices,
        infos,
        balances,
        disabledTokens
      );
      setAssets(assets);

      setOverallPriceChange(overallPriceChange);
      setOverallBalance(overallBalance);
    }

    if (activeAccount && balances) {
      go();
    }
  }, [activeAccount, balances]);

  useEffect(() => {
    if (snackbar?.show) {
      setTimeout(() => {
        setIsSnackbarOpen(true);
        setSnackbarMessage(snackbar.message);
      }, 400);
    }
  }, []);

  useEffect(() => {
    async function go() {
      if (accountBalances && accountBalances?.address !== activeAccount?.address) {
        dispatch(toggleLoading(true));
      }
    }

    go();
  }, []);

  const renderBallance = (balance: string): ReactNode => {
    const splited = balance.split('.');

    return (
      <>
        <span style={{ fontSize: 42 }}>{splited[0]}</span>.
        <span style={{ fontSize: 30 }}>{splited[1]}</span>
      </>
    );
  };

  // Todo refactor Hrant, attach price to the network from polkadot.js file
  // it can be calculated via [prices, tokenInfos] that are stored in the
  // localStorage and globalState as well
  const itemName = useMemo(() => assets.map((el: Asset) => el.chain), [assets]);
  const filtered = useMemo(
    () =>
      assets.filter(
        ({ chain }, index: number) => chain !== 'westend' && !itemName.includes(chain, index + 1)
      ),
    [assets]
  );

  const reduceAssets = useMemo(
    () =>
      assets.reduce((c: any, v: Asset) => {
        c[v.chain] = (c[v.chain] || 0) + v.calculatedPrice;
        return c;
      }, {}),
    [assets]
  );

  const networks = useMemo(
    () =>
      filtered.map((el: Asset) => {
        const samCalculatedPrice = Object.keys(reduceAssets).filter((item) => el.chain === item);
        const filteredSimilarAssets = assets.filter((item: Asset) => item.chain === el.chain);

        return {
          ...el,
          calculatedPrice: reduceAssets[samCalculatedPrice[0]],
          assetsCount: filteredSimilarAssets.length
        };
      }),
    [assets, filtered, reduceAssets]
  );

  return (
    <Container bg={dashboardBG}>
      <Header menuInitialOpenState={isMenuOpen} />
      <Content>
        {activeAccount?.meta?.notSecured && (
          <SecureNowMessage onClick={() => goTo(CreateAccount, { redirectedFromDashboard: true })}>
            <SecureNowIcon />
            <span>Your account is not backed up, please secure now</span>
            <RightArrowMenuIcon fill="#e1e7f3" stroke="#111" />
          </SecureNowMessage>
        )}
        <>
          <BalanceContainer>
            {/* <span>Balance</span> */}
            <Balance>
              <span>
                <TitleSmallText>$</TitleSmallText>
                {(overallBalance || overallBalance === 0) && !accountsChanging
                  ? renderBallance(new BigNumber(overallBalance).toFormat(2))
                  : '...'}{' '}
              </span>
            </Balance>
            <PriceChange negativeValue={negativeValue}>
              {accountsChanging ? (
                '...'
              ) : (
                <>
                  {overallPriceChange && overallPriceChange > 0 ? '+' : ''}
                  {overallPriceChange && new BigNumber(overallPriceChange).toFormat(2)}%
                </>
              )}
            </PriceChange>
          </BalanceContainer>

          <Buttons>
            <StyledLink component={Send}>
              <Button>
                <RightArrowContainer>
                  <SendIcon stroke="#111" />
                </RightArrowContainer>
                <span>Send</span>
              </Button>
            </StyledLink>
            <StyledLink component={Receive}>
              <Button>
                <BarcodeIconContainer>
                  <ReceiveIcon width={20} height={20} />
                </BarcodeIconContainer>
                <span>Recieve</span>
              </Button>
            </StyledLink>
          </Buttons>
        </>
        <List>
          <ListHeader>
            <ListHeaderItem onClick={() => handleActiveTab(1)} index={1} active={activeTab}>
              ASSETS
            </ListHeaderItem>
            <ListHeaderItem onClick={() => handleActiveTab(2)} index={2} active={activeTab}>
              NETWORKS
            </ListHeaderItem>
            <SwitchAssetIconContainer onClick={() => goTo(AddRemoveToken)}>
              <SwitchAssetsIcon />
            </SwitchAssetIconContainer>
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
                    networks.map((network: Asset) => {
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
  padding-top: 42px;
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

const SecureNowMessage = styled.div`
  width: 85%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 70px;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 4px;
  border: solid 1.5px #ffc44c;
  cursor: pointer;
  /* margin-top: 20px; */

  span {
    font-family: 'IBM Plex Sans';
    font-size: 11px;
    color: #000;
  }
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
  display: flex;
  flex-direction: column;
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
  word-break: break-word;
  span {
    font-family: 'IBM Plex Sans';
    font-size: 30px;
    font-weight: 500;
  }
`;

const PriceChange = styled.div<{ negativeValue: boolean }>`
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  color: #606060;
  line-height: 19px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ negativeValue }) => (!negativeValue ? '#45b26b' : '#606060')};
`;

const TitleSmallText = styled.span`
  font-size: 32px !important;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-top: 12px;
`;

const RightArrowContainer = styled.div`
  margin-top: 3px;
`;

const BarcodeIconContainer = styled.div`
  margin-right: 5px;
`;

const SwitchAssetIconContainer = styled.div`
  cursor: pointer;
  margin-left: auto;
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
  margin-top: 71px;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
  padding: 0 5px;
`;

const ListHeaderItem = styled.div<{ index: number; active: number }>`
  cursor: pointer;
  font-family: Inter;
  font-size: 12px;
  font-weight: ${({ index, active }) => (index === active ? '500' : '400')};
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
  height: 213px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 6px;
  overflow-y: hidden;
  position: relative;
`;

const ListContentChild = styled.div`
  width: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  :nth-child(2) {
    margin-left: 10px;
  }
`;
