import { useState } from 'react';
import styled from 'styled-components';
import RightArrow from 'assets/svgComponents/RightArrow';
import { Link } from 'react-chrome-extension-router';
import ExportAllAccounts from 'pages/ExportAllAccounts/ExportAllAccounts';
import SignUp from 'pages/SignUp/SignUp';
import { LogoutIcon } from '@heroicons/react/outline';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import { clearFromStorage, saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import AddressBook from 'pages/AddressBook/AddressBook';
import MenuHeader from 'components/MenuHeader/MenuHeader';

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
      <MenuHeader isOpen={isOpen} setOpen={setOpen} onClose={() => onClose()} showUser={true} />

      <List>
        <ListItem>
          <StyledLink component={ExportAllAccounts}>
            <span>Export All Accounts</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink component={AddressBook}>
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
  height: 600px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 15px 15px 50px 15px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
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
  :nth-child(2) {
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
