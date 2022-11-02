import DownArrowIcon from "assets/svgComponents/DownArrowIcon";
import styled from "styled-components/macro";
import { Turn as Hamburger } from "hamburger-react";
import { useEffect, useRef, useState } from "react";
import Popup from "components/Popup/Popup";
import Accounts from "components/popups/Accounts";
import { useAccount } from "context/AccountContext";
import Menu from "components/Menu/Menu";
import BackIcon from "assets/svgComponents/BackIcon";
import CloseArrowIcon from "assets/svgComponents/CloseArrowIcon";
import { truncateString } from "utils";
import CloseSmallIcon from "assets/svgComponents/CloseSmallIcon";
import ExpandIcon from "assets/svgComponents/ExpandIcon";

type Props = {
  title?: string;
  backAction?: () => void;
  closeAction?: () => void;
  iconStyle?: "Close" | "LeftArrow";
  menuInitialOpenState?: boolean;
  bgColor?: string;
  stroke?: string;
  smallIcon?: boolean;
};

export default function Header({
  title,
  backAction,
  iconStyle,
  closeAction,
  menuInitialOpenState,
  bgColor,
  stroke,
  smallIcon = false,
}: Props) {
  const account = useAccount();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(menuInitialOpenState || false);
  const [isHamburgerOpen, setOpen] = useState<boolean>(false);
  const [userContainerWidth, setUserContainerWidth] = useState<number>(0);

  const name = account?.getActiveAccount()?.meta?.name;
  const accountImg = account?.getActiveAccount()?.meta?.img;

  return (
    <Container bgColor={bgColor}>
      {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      <Content>
        <UserContainer ref={containerRef} onClick={() => setIsPopupOpen(true)}>
          <Avatar img={accountImg} />
          <UserName>{name}</UserName>
          <DownIconContainer>
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
              <BackIcon stroke={stroke} />
            </TopIconContainer>
          )}

          <Title>{title}</Title>

          {closeAction && (
            <CloseIconContainer smallIcon={smallIcon} onClick={closeAction}>
              {smallIcon ? <CloseSmallIcon /> : <CloseArrowIcon />}
            </CloseIconContainer>
          )}
        </TitleContainer>
      )}

      {isPopupOpen && (
        <Popup onClose={() => setIsPopupOpen(false)}>
          <Accounts userContainerWidth={userContainerWidth} />
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
  padding: 0 15px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  z-index: 5;
  background-color: ${({ bgColor }) => bgColor || "transparent"};
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 5px;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  max-width: 200px;
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
  font-family: "IBM Plex Sans";
  font-size: 14px;
  font-weight: 500;
  color: #18191a;
  letter-spacing: 0.28px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin-top: 7px;
  text-align: center;
`;

const TopIconContainer = styled.div`
  cursor: pointer;
`;

const CloseIconContainer = styled.div<{ smallIcon: boolean }>`
  margin-right: ${({ smallIcon }) => (smallIcon ? "6px" : "0")};
  cursor: pointer;
`;

const Title = styled.span`
  margin-left: auto;
  margin-right: auto;
  font-family: "IBM Plex Sans";
  color: #18191a;
  font-weight: 500;
  font-size: 17px;
  line-height: 40px;
  letter-spacing: 0.1em;
  text-align: center;

  width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
