import styled from 'styled-components';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { useEffect, useState } from 'react';
import Config from 'config/config.json';
import Header from './Header';
import Footer from './Footer';
import { useAccount } from 'context/AccountContext';
import Accounts from 'components/popups/Accounts';
import Popup from 'components/Popup/Popup';
import keyring from '@polkadot/ui-keyring';
import Menu from 'components/Menu/Menu';
import ChainItem from './ChainItem';
import config from 'config/config.json';
import { Account_Search } from 'utils/Api';
import { getAssets, getNetworks } from 'utils/polkadot';
import NetworkItem from './NetworkItem';
import walletBG from 'assets/imgs/walletBG.jpg';
import { Link } from 'react-chrome-extension-router';
import SelectAsset from 'pages/Send/SelectAsset';
import Send from 'pages/Send/Send';
import Receive from 'pages/Recieve/Receive';

export default function Wallet() {
  const account = useAccount();
  // todo determine balance type
  const [balance, setBalance] = useState<any>();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  // const [activeAccount, setActiveAccount] = useState<any>();
  // todo determine api type
  const [assets, setAssets] = useState<any>([]);
  const [networks, setNetworks] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [data, setData] = useState<any>();
  const [balanceLoading, setBalanceLoading] = useState<boolean>(false);
  const [overallBalance, setOverallBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    const activeAccount = account.getActiveAccount();

    async function go() {
      // TODO proper typing

      const { overallBalance, assets }: any = await getAssets(activeAccount?.address);
      setAssets(assets);
      setOverallBalance(overallBalance);

      const networks = await (await getNetworks()).filter((network) => network.symbol !== 'wnd');
      setNetworks(networks);
    }

    if (activeAccount) {
      go();
    }
  }, [account.getActiveAccount()]);

  return (
    <Container bg={walletBG}>
      <Header />

      <Content>
        <BalanceContainer>
          <span>Balance</span>
          <Balance>
            <span> ${overallBalance || overallBalance === 0 ? overallBalance : '...'} </span>
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
            <ListHeaderItem onClick={() => setActiveTab(1)} index={1} active={activeTab}>
              ASSETS
            </ListHeaderItem>
            <ListHeaderItem onClick={() => setActiveTab(2)} index={2} active={activeTab}>
              NETWORKS
            </ListHeaderItem>
          </ListHeader>
          <ListContentParent>
            <ListContentChild>
              {activeTab === 1
                ? assets &&
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
          </ListContentParent>
        </List>
      </Content>
      <Footer />
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
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  :nth-child(2) {
    margin-left: 10px;
  }
`;
