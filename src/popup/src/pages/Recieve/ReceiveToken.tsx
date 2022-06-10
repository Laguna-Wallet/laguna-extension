import styled from 'styled-components';
import Header from 'pages/Wallet/Header';
import WrongQRCode from 'react-qr-code';
const QRCode: any = WrongQRCode;

import HumbleInput from 'components/primitives/HumbleInput';
import ReceiveSelect from './components/ReceiveSelect';
import { useState } from 'react';

import { Network } from 'utils/types';
import { useWizard } from 'react-use-wizard';
import { goTo } from 'react-chrome-extension-router';
import Wallet from 'pages/Wallet/Wallet';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import { PropsFromTokenDashboard } from './Receive';
import Snackbar from 'components/Snackbar/Snackbar';

type Props = {
  selectedNetwork: Network | undefined;
  recoded: string;
  propsFromTokenDashboard?: PropsFromTokenDashboard;
};

export default function ReceiveToken({ selectedNetwork, recoded, propsFromTokenDashboard }: Props) {
  const { previousStep } = useWizard();

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // todo case when there are multiple symbols
  const [selectedToken, setSelectedToken] = useState<string>();
  const tokens = selectedNetwork && [selectedNetwork.symbol];

  const handleClickCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setIsSnackbarOpen(true);
    setSnackbarMessage('Address Copied');
  };

  return (
    <Container>
      <Header
        title={`Receive ${selectedNetwork?.chain.toLocaleUpperCase()}`}
        backAction={() =>
          propsFromTokenDashboard?.fromTokenDashboard
            ? goTo(TokenDashboard, { asset: propsFromTokenDashboard.asset })
            : previousStep()
        }
        closeAction={() => goTo(Wallet)}
        bgColor="#f2f2f2"
      />
      <Content>
        {recoded && (
          <QRCodeWrapper>
            <QRCode value={recoded} size={180} />
          </QRCodeWrapper>
        )}

        <ContentItem>
          <Text>ADDRESS:</Text>
          <HumbleInput
            id="address"
            type={'text'}
            value={recoded}
            height="48px"
            bgColor="#F2F2F2"
            borderColor="#F2F2F2"
            fontSize="16px"
            padding="12px 16px"
            color="#000"
            truncate={true}
            copy={true}
            handleClickCopy={handleClickCopy}
          />
        </ContentItem>

        <ContentItem>
          <Text>ASSET:</Text>
          <ReceiveSelect
            selectedNetwork={selectedNetwork}
            setSelectedToken={setSelectedToken}
            selectedToken={selectedToken}
            options={tokens}
          />
        </ContentItem>

        <BottomText>
          This address can only be used to receive assets on the{' '}
          <span>{selectedNetwork?.chain}</span> chain.
        </BottomText>
        <Snackbar
          width="194.9px"
          isOpen={isSnackbarOpen}
          close={() => setIsSnackbarOpen(false)}
          message={snackbarMessage}
          type="success"
          // left="110px"
          bottom="30px"
        />
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
  padding-top: 92px;
  box-sizing: border-box;
  position: relative;
  background-size: cover;
  background-color: #f2f2f2;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px 26px 30.5px;
  box-sizing: border-box;
  border-radius: 10px 10px 0px 0px;
  background-color: #fff;
`;

const QRCodeWrapper = styled.div`
  border: 1px solid #f2f2f2;
  padding: 21px 22px;
  margin-bottom: 5px;
`;

const ContentItem = styled.div`
  width: 100%;
  margin-top: 13px;
`;

const Text = styled.div`
  font-family: Inter;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
  line-height: 144%;
  display: flex;
  align-items: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #777e91;
`;

const BottomText = styled.div`
  max-width: 200px;
  width: 100%;
  font-weight: 400;
  margin-top: 30.5px;
  text-align: center;
  font-family: IBMPlexSans;
  font-size: 12px;
  text-align: center;
  color: #18191a;
  line-height: 1.35;
  span {
    text-transform: capitalize;
  }
`;
