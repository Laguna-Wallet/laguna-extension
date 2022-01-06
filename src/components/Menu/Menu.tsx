import { useState } from 'react';
import styled from 'styled-components';
import { Turn as Hamburger } from 'hamburger-react';
import RightArrow from 'assets/svgComponents/RightArrow';
import { Link } from 'react-chrome-extension-router';
import ExportAllAccounts from 'pages/ExportAllAccounts/ExportAllAccounts';
import SignUp from 'pages/SignUp/SignUp';
import { LogoutIcon } from '@heroicons/react/outline';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import { clearFromStorage, saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';

type Props = {
  onClose: () => void;
};

export default function Menu({ onClose }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);

  const handleLogout = () => {
    clearFromStorage(StorageKeys.SignedIn);
    saveToStorage({ key: StorageKeys.LoggedOut, value: 'true' });
  };

  return (
    <Container>
      <Header>
        <span>HYDROX</span>
        <BurgerMenu onClick={onClose}>
          <Hamburger toggled={isOpen} toggle={setOpen} size={20} color="#fff" />
        </BurgerMenu>
      </Header>
      <User>
        <IconContainer></IconContainer>
        <Text>
          <Name>Skywalker</Name>
          <Address>H32x...3df</Address>
        </Text>
      </User>
      <List>
        <ListItem>
          <StyledLink component={ExportAllAccounts}>
            <span>Export All Accounts</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Address Book</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Trusted Apps</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Change Password</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Auto-Lock Timer</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span> Change Network</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Remove Wallet</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
      </List>
      <StyledLogoutLink onClick={handleLogout} component={WelcomeBack}>
        <LogoutIcon width={15} />
        <span>Log Out</span>
      </StyledLogoutLink>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 15px 15px 50px 15px;
  box-sizing: border-box;
  background-color: #111111;
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

const List = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #fff;
  margin-top: 50px;
`;

const ListItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  cursor: pointer;
  margin-top: 12px;
  pointer-events: none;
  :nth-child(1) {
    margin-top: 0;
    pointer-events: inherit;
  }
`;

const StyledLink = styled(Link)<{ color?: string }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  color: ${({ color }) => color || '#fff'};
`;

const StyledLogoutLink = styled(Link)`
  width: 100%;
  display: flex;
  text-decoration: none;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Sequel100Wide55Wide';
  span {
    margin-left: 4px;
  }
`;
