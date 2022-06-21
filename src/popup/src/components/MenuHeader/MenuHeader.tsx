import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import BackIcon from 'assets/svgComponents/BackIcon';
import MenuCloseIcon from 'assets/svgComponents/MenuIcons/MenuCloseIcon';
import { useAccount } from 'context/AccountContext';
import { resizeFile, truncateString } from 'utils';
import useOutsideClick from 'hooks/useOutsideClick';
import { addAccountMeta, changeAccountPicture } from 'utils/polkadot';
import PencilIcon from 'assets/svgComponents/PencilIcon';
import MenuLockIcon from 'assets/svgComponents/MenuIcons/MenuLockIcon';
import { Messages, StorageKeys } from 'utils/types';
import { saveToStorage } from 'utils/chrome';
import MenuMainLogo from 'assets/svgComponents/MenuIcons/MenuMainLogo';
import AvatarEditIcon from 'assets/svgComponents/AvatarEditIcon';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';
import browser from 'webextension-polyfill';

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onClose: () => void;
  showUser?: boolean;
  title?: string;
  backAction?: () => void;
};

export default function MenuHeader({ showUser, onClose, title, backAction }: Props) {
  const account = useAccount();
  const history = useHistory();

  const [name, setName] = useState(account?.getActiveAccount()?.meta?.name);
  const [editMode, setEditMode] = useState<boolean>(false);
  const inputFile = useRef<HTMLInputElement>(null);

  const address = account?.getActiveAccount()?.address;
  const accountImg = account?.getActiveAccount()?.meta?.img;

  const editAccount = () => {
    const val = name ? name : address;
    setName(val);
    setEditMode(false);
    const newAccount = addAccountMeta(address, { name: val });
    account.saveActiveAccount(newAccount);
  };

  const inputRef = useOutsideClick(() => {
    if (editMode) {
      editAccount();
    }
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.keyCode === 14) {
      editAccount();
    }
  };

  const formatName = (name: string) => {
    return name && name?.length > 12 ? truncateString(name) : name;
  };

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const base64 = await resizeFile(event.target.files[0]);
    const newAccount = changeAccountPicture(address, { img: base64 });
    account.saveActiveAccount(newAccount);
  };

  const handleLogout = () => {
    browser.runtime.sendMessage({
      type: Messages.LogOutUser
    });
    history.push(router.home);
  };

  return (
    <Container>
      <Header>
        <LogoContainer>
          <MenuMainLogo />
          <span>Laguna</span>
        </LogoContainer>
        <HeaderLeft>
          <LockContainer onClick={handleLogout}>
            <MenuLockIcon />
          </LockContainer>
          <BurgerMenu onClick={onClose}>
            <MenuCloseIcon />
          </BurgerMenu>
        </HeaderLeft>
      </Header>
      {title && (
        <Title>
          <LeftArrowContainer onClick={backAction}>
            <BackIcon stroke="white" />
          </LeftArrowContainer>
          <TitleText>{title}</TitleText>
        </Title>
      )}
      {showUser && (
        <User>
          <IconContainer img={accountImg} onClick={onButtonClick}>
            <ImageContainerOverlay>
              <AvatarEditIcon />
            </ImageContainerOverlay>
          </IconContainer>
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept="image/png, image/jpeg, image/svg+xml"
          />
          <Text>
            <Name>
              <NameInput
                ref={inputRef}
                value={formatName(name) || ''}
                onChange={(e) => setName(e.target.value)}
                readOnly={!editMode}
                onKeyDown={(e) => {
                  handleKeyPress(e);
                }}
              />
              <PencilIconContainer
                onClick={() => {
                  setEditMode(true);
                  inputRef && inputRef?.current?.focus();
                }}>
                <PencilIcon width={14} height={14} fill="#777E91" />
              </PencilIconContainer>
            </Name>
            {/* <Address>{address && truncateString(address)}</Address> */}
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
  font-size: 17px;
  font-family: 'Work Sans';
  font-weight: 500;
  height: 58px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: 9px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  width: 54px;
`;

const LockContainer = styled.div`
  cursor: pointer;
  z-index: 9999;
  height: 24px;
  width: 24px;
`;

const BurgerMenu = styled.div`
  margin-left: 6px;
  cursor: pointer;
  height: 24px;
  width: 24px;
`;

const User = styled.div`
  display: flex;
  border-bottom: 1px solid #bbbbbb;
  padding-bottom: 20px;
  align-items: center;
  margin-top: 4px;
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  flex: 1;
  margin-left: 18px;
  color: #fff;
  font-family: 'IBM Plex Sans';
  font-size: 23px;
  font-weight: 500;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
`;

const NameInput = styled.input`
  max-width: 146px;
  width: 100%;
  background-color: transparent;
  color: #fff;
  font-size: 23px;
  font-family: 'IBM Plex Sans';
  font-weight: 500;
  border: 0;
  outline: 0;
`;

const PencilIconContainer = styled.div`
  cursor: pointer;
`;

const ImageContainerOverlay = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  background-color: #1111118c;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.div<{ img: string }>`
  width: 64px;
  height: 64px;
  border-radius: 100%;
  background-color: #ccc;
  cursor: pointer;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  &:hover ${ImageContainerOverlay} {
    display: flex;
  }
`;

const Title = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.p`
  font-family: 'IBM Plex Sans';
  font-weight: 500;
  font-size: 17px;
  line-height: 40px;
  text-align: center;
  letter-spacing: 0.1em;
  color: #ffffff;
`;

const LeftArrowContainer = styled.div`
  position: absolute;
  left: 0;
  top: 8px;
  height: 24px;
  margin-right: auto;
  cursor: pointer;
`;
