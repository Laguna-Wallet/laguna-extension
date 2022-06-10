import styled from 'styled-components';
import Button from 'components/primitives/Button';
import { useEnterClickListener } from 'hooks/useEnterClickListener';

type Props = {
  onClose: () => void;
};

export function HelpImport({ onClose }: Props) {
  useEnterClickListener(() => onClose(), []);

  return (
    <Container>
      <MainContent>
        <Indicator />
        <Title>
          Help <Dash /> Importing a Wallet
        </Title>
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
  background: rgba(0, 0, 0, 0.3);
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
  height: 365px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 26px 29px 26px;
  box-sizing: border-box;
  background-color: #f8f8f9;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled.h3`
  width: 100%;
  font-family: 'IBM Plex Sans';
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 17px;
  font-stretch: normal;
  font-style: normal;
  line-height: 2.35;
  letter-spacing: normal;
  text-align: left;
  color: #18191a;
  margin-top: 10px;
  font-weight: 600;
`;

const Dash = styled.div`
  width: 12px;
  height: 2px;
  background: #18191a;
  margin: 0 3px;
`;

const Description = styled.div`
  display: flex;
  color: #353945;
  font-family: 'Inter';
  font-weight: 400;
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
