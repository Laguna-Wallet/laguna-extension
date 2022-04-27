import styled from 'styled-components';
import Button from 'components/primitives/Button';

type Props = {
  onClose: () => void;
};

export function HelpImport({ onClose }: Props) {
  return (
    <Container>
      <MainContent>
        <Indicator />
        <Title>Help - Importing a Wallet</Title>
        <Description>
          <span>
            When entering your 12 or 24 mnemonic seed phrase please separate each word with a single
            space and double check the spelling carefully.
          </span>
          <span>
            Entering a Polkadot address will import a &apos;Watch Only &apos; account. For more help
            visit our <b>&apos;import a wallet&apos;</b> wiki page.
          </span>
        </Description>

        <ButtonContainer>
          <Button
            bgColor="#18191a"
            color="#ffffff"
            justify="center"
            onClick={onClose}
            text={'Close'}
          />
        </ButtonContainer>
      </MainContent>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
`;

const Indicator = styled.div`
  width: 48px;
  height: 6px;
  flex-grow: 0;
  border-radius: 100px;
  background-color: #e6e8ec;
`;

const MainContent = styled.div`
  width: 100%;
  height: 342px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 16px 38px 16px;
  box-sizing: border-box;
  background-color: #f8f8f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled.h3`
  width: 100%;
  font-family: 'IBM Plex Sans';
  margin: 0;
  font-size: 17px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.35;
  letter-spacing: normal;
  text-align: left;
  color: #18191a;
  margin-top: 10px;
`;

const Description = styled.div`
  display: flex;
  color: #353945;
  font-family: 'IBM Plex Sans';
  flex-direction: column;
  font-size: 16px;
  margin-top: 10px;
  line-height: 1.45;
  span {
    margin-top: 10px;
  }

  p {
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
`;

const Gap = styled.div`
  width: 20px;
`;