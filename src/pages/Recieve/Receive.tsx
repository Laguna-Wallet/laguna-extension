import styled from 'styled-components';
import Header from 'pages/Wallet/Header';
import QRCode from 'react-qr-code';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import { useAccount } from 'context/AccountContext';
import HumbleInput from 'components/primitives/HumbleInput';
import ReceiveSelect from './components/ReceiveSelect';
import { useEffect, useState } from 'react';
import { getAssets } from 'utils/polkadot';
import { Asset } from 'utils/types';

export default function Receive() {
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    async function go() {
      // TODO proper typing

      const { overallBalance, assets }: any = await getAssets(activeAccount?.address);
      setAssets(assets);
    }

    if (activeAccount) {
      go();
    }
  }, [account.getActiveAccount()]);

  return (
    <Container>
      <Header title={`Receive Polkadot`} backAction={() => goTo(Wallet)} />
      <Content>
        <QRCode value={activeAccount.address} size={180} />

        <ContentItem>
          <Text>Address:</Text>
          <HumbleInput
            id="address"
            type={'text'}
            onChange={() => {
              console.log('onChange');
            }}
            value={activeAccount.address}
            height="48px"
            marginTop="10px"
            bgColor="#F2F2F2"
            borderColor="#F2F2F2"
          />
        </ContentItem>

        <ContentItem>
          <Text>ASSET:</Text>
          <ReceiveSelect options={assets} />
        </ContentItem>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 150px;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 35px;
  box-sizing: border-box;
`;

const QRContainer = styled.div`
  width: 226px;
  height: 227.23px;
`;

const ContentItem = styled.div`
  width: 100%;
  margin-top: 15px;
`;

const Text = styled.div`
  font-size: 14px;
  color: #8c8c8c;
  font-family: 'Sequel100Wide55Wide';
`;
