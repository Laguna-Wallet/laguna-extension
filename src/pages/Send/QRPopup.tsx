import Button from 'components/primitives/Button';
import Header from 'pages/Wallet/Header';
import styled from 'styled-components';

type Props = {
  handleCloseQR: () => void;
};

export default function QRPopup({ handleCloseQR }: Props) {
  return (
    <Container>
      <Header title="SCAN QR CODE" iconStyle="Close" backAction={handleCloseQR} />
      <Content>
        <ScannerContainer></ScannerContainer>
        <Text>Please scan the QR code for the wallet you wish to send the assets to</Text>

        <Button
          text="Cancel"
          justify="center"
          bgColor="#e8e8e8"
          margin="auto 0 0 0"
          color="#111"
          onClick={handleCloseQR}
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
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-bottom: 38px;
  padding-top: 180px;
  position: absolute;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
  background-color: #111;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  box-sizing: border-box;
`;

const ScannerContainer = styled.div`
  width: 205px;
  height: 205px;
  background-color: #fff;
  border-radius: 10px;
`;

const Text = styled.div`
  font-family: 'SFCompactDisplayRegular';
  line-height: 1.45;
  text-align: center;
  color: #898989;
  margin-top: 25px;
  width: 323.1px;
`;