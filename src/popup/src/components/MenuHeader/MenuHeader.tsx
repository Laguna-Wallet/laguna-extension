import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import MenuCloseIcon from 'assets/svgComponents/MenuIcons/MenuCloseIcon'
import { useAccount } from 'context/AccountContext';
import { resizeFile, truncateString } from 'utils';
import useOutsideClick from 'hooks/useOutsideClick';
import { addAccountMeta, changeAccountPicture } from 'utils/polkadot';
import EditIcon from 'assets/svgComponents/EditIcon';
import PencilIcon from 'assets/svgComponents/PencilIcon';
import MenuLockIcon from 'assets/svgComponents/MenuIcons/MenuLockIcon';
import { StorageKeys } from 'utils/types';
import { clearFromStorage, saveToStorage } from 'utils/chrome';
import { goTo } from 'react-chrome-extension-router';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import MenuMainLogo from 'assets/svgComponents/MenuIcons/MenuMainLogo';

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onClose: () => void;
  showUser?: boolean;
  title?: string;
  backAction?: () => void;
};

export default function MenuHeader({
  showUser,
  onClose,
  title,
  backAction
}: Props) {
  const account = useAccount();
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
    clearFromStorage(StorageKeys.SignedIn);
    saveToStorage({ key: StorageKeys.LoggedOut, value: 'true' });
    goTo(WelcomeBack);
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
            <LeftArrowIcon fill="#111" stroke="#fff" />
          </LeftArrowContainer>
          <TitleText>{title}</TitleText>
        </Title>
      )}
      {showUser && (
        <User>
          <IconContainer img={accountImg} onClick={onButtonClick}>
            <ImageContainerOverlay>
            <PencilIcon width={25} height={25} fill="#fff" />
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
  height: 48px;
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
  justify-content: space-between;
  align-items: center;
`;

const NameInput = styled.input`
  width: 200px;
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
  position: absolute;
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
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  &:hover ${ImageContainerOverlay} {
    display: flex;
  }
`;

const Title = styled.span`
  width: 100%;
  font-family: '';
  font-size: 17px;
  letter-spacing: 0.85px;
  color: #fff;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const TitleText = styled.div`
  margin-right: auto;
  font-family: 'IBM Plex Sans';
`;

const LeftArrowContainer = styled.div`
  margin-right: auto;
  cursor: pointer;
`;
