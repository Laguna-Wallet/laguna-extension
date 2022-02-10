import styled from 'styled-components';
import { Turn as Hamburger } from 'hamburger-react';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import Wallet from 'pages/Wallet/Wallet';
import { goTo } from 'react-chrome-extension-router';
import { useAccount } from 'context/AccountContext';
import { truncateString } from 'utils';
import { useRef, useState } from 'react';
import { PencilAltIcon, PencilIcon } from '@heroicons/react/outline';
import useOutsideClick from 'hooks/useOutsideClick';
import { addAccountMeta } from 'utils/polkadot';
import { saveToStorage } from 'utils/chrome';
import { StorageKeys } from 'utils/types';
import AddressBook from 'pages/AddressBook/AddressBook';

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onClose: () => void;
  showUser?: boolean;
  title?: string;
  backAction?: () => void;
};

export default function MenuHeader({
  isOpen,
  setOpen,
  showUser,
  onClose,
  title,
  backAction
}: Props) {
  const account = useAccount();
  const [name, setName] = useState(account.getActiveAccount()?.meta?.name);
  const [editMode, setEditMode] = useState<boolean>(false);

  const address = account.getActiveAccount().address;

  const editAccount = () => {
    setEditMode(false);
    const newAccount = addAccountMeta(address, { name });
    account.saveActiveAccount(newAccount);
  };

  const inputRef = useOutsideClick(() => {
    if (editMode) {
      editAccount();
    }
  });

  const handleKeyPress = (e: any) => {
    console.log(e);
    if (e.key === 'Enter' || e.keyCode === 13) {
      editAccount();
    }
  };

  const formatName = (name: string) => {
    return name.length > 12 ? truncateString(name) : name;
  };

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
          <LeftArrowContainer onClick={backAction}>
            <LeftArrowIcon width={30} stroke="#fff" />
          </LeftArrowContainer>
          <TitleText>{title}</TitleText>
        </Title>
      )}
      {showUser && (
        <User>
          <IconContainer></IconContainer>
          <Text>
            <Name>
              <NameInput
                ref={inputRef}
                value={formatName(name)}
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
                <PencilIcon width={15} />
              </PencilIconContainer>
            </Name>
            <Address>{truncateString(address)}</Address>
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
  flex: 1;
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
  font-family: 'Sequel100Wide55Wide';
  border: 0;
  outline: 0;
`;

const PencilIconContainer = styled.div`
  cursor: pointer;
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
