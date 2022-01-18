import styled from 'styled-components';
import { Turn as Hamburger } from 'hamburger-react';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onClose: () => void;
  showUser?: boolean;
  title?: string;
  backAction?: () => void;
};

export default function MenuHeader({ isOpen, setOpen, showUser, onClose, title }: Props) {
  return (
    <Container>
      <Header>
        <span>HYDROX</span>
        <BurgerMenu>
          <Hamburger toggled={isOpen} toggle={onClose} size={20} color="#fff" />
        </BurgerMenu>
      </Header>
      {title && (
        <Title>
          <LeftArrowContainer onClick={() => goTo(Wallet, { isMenuOpen: true })}>
            <LeftArrowIcon width={30} stroke="#fff" />
          </LeftArrowContainer>
          <TitleText>{title}</TitleText>
        </Title>
      )}
      {showUser && (
        <User>
          <IconContainer></IconContainer>
          <Text>
            <Name>Skywalker</Name>
            <Address>H32x...3df</Address>
          </Text>
        </User>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 13px;
  font-family: 'Sequel100Wide55Wide';
`;

const BurgerMenu = styled.div``;

const User = styled.div`
  display: flex;
  border-bottom: 1px solid #bbbbbb;
  padding-bottom: 20px;
  align-items: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-left: 20px;
  color: #fff;
  font-family: 'Sequel100Wide55Wide';
`;

const Name = styled.div`
  font-size: 23px;
`;

const Address = styled.div`
  color: #8f8f8f;
  font-size: 12px;
`;

const IconContainer = styled.div`
  width: 67px;
  height: 67px;
  border-radius: 100%;
  background-color: #ccc;
`;

const Title = styled.span`
  width: 100%;
  font-family: 'Sequel100Wide55Wide';
  font-size: 17px;
  letter-spacing: 0.85px;
  color: #fff;
  display: flex;
  justify-content: center;
`;

const TitleText = styled.div`
  /* margin-left: auto; */
  margin-right: auto;
`;

const LeftArrowContainer = styled.div`
  margin-right: auto;
  cursor: pointer;
`;
