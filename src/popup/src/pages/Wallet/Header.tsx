import DownArrowIcon from 'assets/svgComponents/DownArrowIcon';
import styled from 'styled-components/macro';
import ButtonsIcon from 'assets/svgComponents/ButtonsIcon';
import { Turn as Hamburger, Turn } from 'hamburger-react';
import { ReactNode, useState } from 'react';
import Popup from 'components/Popup/Popup';
import Accounts from 'components/popups/Accounts';
import { useAccount } from 'context/AccountContext';
import Menu from 'components/Menu/Menu';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import CloseIcon from 'assets/svgComponents/CloseIcon';
import { truncateString } from 'utils';

type Props = {
  title?: string;
  backAction?: () => void;
  iconStyle?: 'Close' | 'LeftArrow';
  menuInitialOpenState?: boolean;
};

export default function Header({ title, backAction, iconStyle, menuInitialOpenState }: Props) {
  const account = useAccount();

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(menuInitialOpenState || false);
  const [isHamburgerOpen, setOpen] = useState<boolean>(false);

  const name = account.getActiveAccount().meta.name;
  const formattedName = name.length > 15 ? truncateString(name) : name;

  return (
    <Container>
      {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      <Content>
        <UserContainer>
          <Avatar />
          <UserName>{formattedName}</UserName>
          <DownIconContainer onClick={() => setIsPopupOpen(true)}>
            <DownArrowIcon />
          </DownIconContainer>
          <ButtonsIconContainer>
            <ButtonsIcon />
          </ButtonsIconContainer>
        </UserContainer>
        <BurgerMenu onClick={() => setIsMenuOpen(true)}>
          <Hamburger toggled={isHamburgerOpen} size={20} />
        </BurgerMenu>
      </Content>

      {title && (
        <TitleContainer>
          {backAction && (
            <LeftArrowContainer onClick={backAction}>
              {iconStyle === 'Close' ? <CloseIcon stroke="#111" /> : <LeftArrowIcon />}
            </LeftArrowContainer>
          )}
          <Title>{title}</Title>
        </TitleContainer>
      )}

      {isPopupOpen && (
        <Popup onClose={() => setIsPopupOpen(false)}>
          <Accounts setActiveAccount={account.saveActiveAccount} />
        </Popup>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #f1f1f1;
  padding: 15px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  z-index: 5;
`;

const Content = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ccc;
`;

const UserName = styled.span`
  font-size: 14px;
  margin-left: 8px;
  font-family: 'Sequel100Wide55Wide';
  letter-spacing: 0.28px;
`;

const DownIconContainer = styled.div`
  margin-left: 8px;
  cursor: pointer;
`;

const ButtonsIconContainer = styled.div`
  margin-left: 8px;
`;

const BurgerMenu = styled.div``;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

const LeftArrowContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.span`
  margin-left: auto;
  margin-right: auto;
  font-family: 'Sequel100Wide55Wide';
  font-size: 17px;
  line-height: 2.35;
  letter-spacing: 0.85px;
`;
