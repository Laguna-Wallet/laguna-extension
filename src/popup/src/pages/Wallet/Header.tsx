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
  closeAction?: () => void;
  iconStyle?: 'Close' | 'LeftArrow';
  menuInitialOpenState?: boolean;
  bgColor?: string;
};

export default function Header({
  title,
  backAction,
  iconStyle,
  closeAction,
  menuInitialOpenState,
  bgColor
}: Props) {
  const account = useAccount();

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(menuInitialOpenState || false);
  const [isHamburgerOpen, setOpen] = useState<boolean>(false);

  const name = account?.getActiveAccount()?.meta?.name;
  const accountImg = account?.getActiveAccount()?.meta?.img;
  const formattedName = name?.length > 15 ? truncateString(name) : name;

  return (
    <Container bgColor={bgColor}>
      {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      <Content>
        <UserContainer>
          <Avatar img={accountImg} />
          <UserName>{formattedName}</UserName>
          <DownIconContainer onClick={() => setIsPopupOpen(true)}>
            <DownArrowIcon />
          </DownIconContainer>
          {/* <ButtonsIconContainer>
            <ButtonsIcon />
          </ButtonsIconContainer> */}
        </UserContainer>
        <BurgerMenu onClick={() => setIsMenuOpen(true)}>
          <Hamburger toggled={isHamburgerOpen} size={20} />
        </BurgerMenu>
      </Content>

      {title && (
        <TitleContainer>
          {backAction && (
            <TopIconContainer onClick={backAction}>
              <LeftArrowIcon fill="#f2f2f2" stroke="#18191a" width={8} height={12} />
            </TopIconContainer>
          )}

          <Title>{title}</Title>

          {closeAction && (
            <TopIconContainer onClick={closeAction}>
              <CloseIcon stroke="#111" />
            </TopIconContainer>
          )}
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

const Container = styled.div<{ bgColor?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15px 15px 7px 15px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  z-index: 5;
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
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

const Avatar = styled.div<{ img: string }>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ccc;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const UserName = styled.span`
  margin-left: 8px;
  font-family: 'IBM Plex Sans';
  font-size: 14px;
  font-weight: 500;
  color: #18191a;
  letter-spacing: 0.28px;
`;

const DownIconContainer = styled.div`
  margin-left: 8px;
  cursor: pointer;
`;

const ButtonsIconContainer = styled.div`
  margin-left: 8px;
`;

const BurgerMenu = styled.div`
  .hamburger-react {
    width: 35px !important;
  }
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

const TopIconContainer = styled.div`
  cursor: pointer;
`;

const Title = styled.span`
  margin-left: auto;
  margin-right: auto;
  font-family: 'IBM Plex Sans';
  color: #18191a;
  font-weight: 500;
  font-size: 17px;
  line-height: 2.35;
  letter-spacing: 1.7px;
`;
