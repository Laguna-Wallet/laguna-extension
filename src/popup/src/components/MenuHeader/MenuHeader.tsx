import styled from 'styled-components';
import { Turn as Hamburger } from 'hamburger-react';
import LeftArrowIcon from 'assets/svgComponents/LeftArrowIcon';
import { useAccount } from 'context/AccountContext';
import { getBase64, truncateString } from 'utils';
import { useRef, useState } from 'react';
import useOutsideClick from 'hooks/useOutsideClick';
import { addAccountMeta } from 'utils/polkadot';
import EditIcon from 'assets/svgComponents/EditIcon';
import PencilIcon from 'assets/svgComponents/PencilIcon';

type Props = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  onClose: () => void;
  showUser?: boolean;
  title?: string;
  backAction?: () => void;
};

const fileTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/x-icon'
];

export default function MenuHeader({
  isOpen,
  setOpen,
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

  const handleKeyPress = (e: any) => {
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
    const base64 = await getBase64(event.target.files[0]);

    const newAccount = addAccountMeta(address, { img: base64 });
    account.saveActiveAccount(newAccount);
  };

  return (
    <Container>
      <Header>
        <span>Laguna</span>
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
          <IconContainer img={accountImg} onClick={onButtonClick}>
            <ImageContainerOverlay>
              <EditIcon width={25} height={25} fill="#fff" />
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
                <PencilIcon />
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
`;

const BurgerMenu = styled.div`
  .hamburger-react {
    width: 33px !important;
  }
`;

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

const Address = styled.div`
  color: #8f8f8f;
  font-size: 12px;
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
  width: 67px;
  height: 67px;
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
