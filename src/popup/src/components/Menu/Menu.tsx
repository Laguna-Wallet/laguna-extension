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
import AutoLockTimer from 'pages/AutoLockTimer/AutoLockTimer';
import RemoveAccount from 'pages/RemoveAccount/RemoveAccount';
import ChangePassword from 'pages/ChangePassword/ChangePassword';
import BackupAccount from 'pages/BackupAccount/BackupAccount';
import ConnectedSites from 'pages/ConnectedSites/ConnectedSites';
import AddressMenuIcon from 'assets/svgComponents/MenuIcons/AddressMenuIcon';
import ConnectedSitesMenuIcon from 'assets/svgComponents/MenuIcons/ConnectedSitesMenuIcon';
import AutoLockTimerMenuIcon from 'assets/svgComponents/MenuIcons/AutoLockTimerMenuIcon';
import ChangePasswordMenuIcon from 'assets/svgComponents/MenuIcons/ChangePasswordMenuIcon';
import BackupMenuIcon from 'assets/svgComponents/MenuIcons/BackupMenuIcon';
import RemoveWalletMenuIcon from 'assets/svgComponents/MenuIcons/RemoveWalletMenuIcon';
import RightArrowMenuIcon from 'assets/svgComponents/MenuIcons/RightArrowMenuIcon';

type Props = {
  onClose: () => void;
};

export default function Menu({ onClose }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);

  return (
    <Container>
      <MenuHeader isOpen={isOpen} setOpen={setOpen} onClose={() => onClose()} showUser={true} />
      <List>
        {/* <ListItem>
          <StyledLink component={ExportAllAccounts}>
            <span>Export All Accounts</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem> */}
        <ListItem>
          <StyledLink component={AddressBook}>
            <AddressMenuIcon />
            <span>Address Book</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink component={ConnectedSites}>
            <ConnectedSitesMenuIcon />
            <span>Connected Sites</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>

        <ListItem>
          <StyledLink component={AutoLockTimer}>
            <AutoLockTimerMenuIcon />
            <span>Auto-Lock Timer</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>
        <ListItem>
          <StyledLink component={ChangePassword}>
            <ChangePasswordMenuIcon />
            <span>Change Password</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>
        {/* <ListItem>
          <StyledLink color={'#c1c1c154'} component={ExportAllAccounts}>
            <span>Change Language</span>
            <RightArrow width={25} />
          </StyledLink>
        </ListItem> */}
        <ListItem>
          <StyledLink component={BackupAccount}>
            <BackupMenuIcon />
            <span>Backup Account</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>

        <ListItem>
          <StyledLink component={RemoveAccount}>
            <RemoveWalletMenuIcon />
            <span>Remove Wallet</span>
            <RightIconContainer>
              <RightArrowMenuIcon width={15} fill="#777e90" />
            </RightIconContainer>
          </StyledLink>
        </ListItem>
      </List>
      {/* <StyledLogoutLink onClick={handleLogout} component={WelcomeBack}>
        <LogoutIcon width={15} />
        <span>Log Out</span>
      </StyledLogoutLink> */}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 542px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 10px 15px 50px 15px;
  box-sizing: border-box;
  background-color: #18191a;
  z-index: 99999;
`;

const List = styled.div`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 50px;
`;

const ListItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  margin-top: 15px;
  pointer-events: none;

  :nth-child(1) {
    margin-top: 0;
    pointer-events: inherit;
    &:hover {
      color: #ffffff;

      path {
        stroke: #fff;
      }
    }
  }
  :nth-child(2) {
    pointer-events: inherit;
    &:hover {
      path {
        stroke: #fff;
      }
    }
  }
  :nth-child(3) {
    pointer-events: inherit;
    &:hover {
      path {
        stroke: #fff;
      }
    }
  }
  :nth-child(4) {
    pointer-events: inherit;
    &:hover {
      path {
        fill: #fff;
      }
    }
  }
  :nth-child(5) {
    pointer-events: inherit;
    &:hover {
      path {
        fill: #fff;
      }
    }
  }
  :nth-child(6) {
    pointer-events: inherit;
    &:hover {
      path {
        fill: #fff;
      }
    }
  }
`;

const RightIconContainer = styled.div`
  ${ListItem}:hover & {
    path {
      stroke: #fff !important;
      fill: #18191a;
    }
  }
`;

const StyledLink = styled(Link)<{ color?: string }>`
  width: 100%;
  display: flex;
  /* justify-content: space-between; */
  text-decoration: none;
  cursor: pointer;
  font-family: Inter;
  font-size: 18px;
  color: ${({ color }) => color || '#efeeeee2'};

  ${ListItem}:hover & {
    color: #fff;
  }
  span {
    margin-left: 13px;
    margin-right: auto;
  }
`;
