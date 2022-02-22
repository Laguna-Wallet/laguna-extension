import styled from 'styled-components';
import Header from 'pages/Wallet/Header';
import QRCode from 'react-qr-code';
import { useAccount } from 'context/AccountContext';
import HumbleInput from 'components/primitives/HumbleInput';
import ReceiveSelect from './components/ReceiveSelect';
import { useState } from 'react';

import { Network } from 'utils/types';
import { useWizard } from 'react-use-wizard';

type Props = {
  selectedNetwork: Network | undefined;
  recoded: string;
};

export default function ReceiveToken({ selectedNetwork, recoded }: Props) {
  const { previousStep } = useWizard();

  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  // todo case when there are multiple symbols
  const [selectedToken, setSelectedToken] = useState<string>();
  const tokens = selectedNetwork && [selectedNetwork.symbol];
  const handleChange = () => {
    console.log('change');
  };

  return (
    <Container>
      <Header
        title={`Receive ${selectedNetwork?.chain.toLocaleUpperCase()}`}
        backAction={() => previousStep()}
      />
      <Content>
        {recoded && <QRCode value={recoded} size={180} />}

        <ContentItem>
          <Text>Address:</Text>
          <HumbleInput
            id="address"
            type={'text'}
            onChange={handleChange}
            value={recoded}
            height="48px"
            marginTop="10px"
            bgColor="#F2F2F2"
            borderColor="#F2F2F2"
            truncate={true}
            copy={true}
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
  padding-bottom: 25px;
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

const BottomText = styled.div`
  font-family: 'SFCompactDisplayRegular';
  font-weight: 400;
  font-size: 14px;
  color: #000000;
  margin-top: auto;
  text-align: center;
  span {
    text-transform: capitalize;
  }
`;
