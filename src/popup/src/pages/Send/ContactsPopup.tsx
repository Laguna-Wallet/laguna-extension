import { PlusIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import AlternateEmail from 'assets/svgComponents/AlternateEmailIcon';
import ContactsIcon from 'assets/svgComponents/ContactsIcon';
import LoopIcon from 'assets/svgComponents/loopIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import AddAddress from 'pages/AddressBook/AddAddress';
import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { truncateString } from 'utils';

type Props = {
  handleCloseContacts: (address: string) => void;
  onBack: () => void;
  closeAction: () => void;
};

export default function ContactsPopup({ handleCloseContacts, onBack, closeAction }: Props) {
  const [accounts, setAccounts] = useState<any[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false);

  useEffect(() => {
    // todo proper typing
    const accounts: any[] = [];
    keyring.getAddresses().forEach((account) => {
      const { name, memo } = account.meta;
      accounts.push({ address: account.address, name, memo });
    });

    setAccounts(accounts);
  }, [isAddAddressOpen]);

  // todo proper typing
  const handleRenderAccounts = (accounts: any[], filterWord: string) => {
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(filterWord.toLowerCase()) ||
        account.address.toLowerCase().includes(filterWord.toLowerCase())
    );
  };

  return (
    <Container>
      <Header
        title="SELECT CONTACT"
        bgColor="#f2f2f2"
        closeAction={closeAction}
        iconStyle="LeftArrow"
        backAction={onBack}
      />
      <InnerContainer>
        <Content>
          {accounts && accounts?.length > 0 && (
            <HumbleInput
              id="search"
              height="45px"
              placeholder="Search"
              type="text"
              bgColor="#f2f2f2"
              placeholderColor="#777e90"
              color="#111"
              value={filter}
              onChange={(e: any) => setFilter(e.target.value)}
              IconAlignment={'left'}
              Icon={<LoopIcon />}
            />
          )}
          {accounts?.length === 0 ? (
            <>
              <AddressBookContainer>
                <AddressBookIcon />
              </AddressBookContainer>
              <Text>No Addresses</Text>
            </>
          ) : (
            <AddressesContainer>
              {accounts &&
                handleRenderAccounts(accounts, filter).map((address) => (
                  <AddressComponent
                    key={address.address}
                    onClick={() => handleCloseContacts(address.address)}>
                    <Text>
                      {address.name}({truncateString(address.address)}){' '}
                    </Text>
                    <ContactsIcon stroke="#111" />
                  </AddressComponent>
                ))}
            </AddressesContainer>
          )}

          <Button
            text="Add Contact"
            Icon={<PlusIcon width={17} />}
            bgColor="#F2F2F2"
            borderColor="#F2F2F2"
            direction="row-reverse"
            color="#111"
            justify="center"
            margin="auto 0 0 0"
            onClick={() => setIsAddAddressOpen(true)}
          />
        </Content>
        {isAddAddressOpen && (
          <AddAddressPopupContainer>
            <AddAddress
              closeAction={() => setIsAddAddressOpen(false)}
              redirectedFromSend={true}
              backAction={() => setIsAddAddressOpen(false)}
            />
          </AddAddressPopupContainer>
        )}
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f2f2f2;
  /* background-image: ${({ bg }) => `url(${bg})`}; */
  background-size: cover;
  padding: 110px 0px 38px 0px;
  position: absolute;
  top: 0;
  z-index: 100;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 82%;
  position: relative;
  padding: 20px 15px;
  box-sizing: border-box;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const AddressBookContainer = styled.div`
  width: 129px;
  height: 129px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: auto;
`;

const AddressesContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;

const AddressComponent = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f3f3;
  color: #fff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
  cursor: pointer;
`;

const AddAddressPopupContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: -110px;
  left: 0;
`;

const Text = styled.div`
  font-family: 'SFCompactDisplayRegular';
  text-align: center;
  color: #111;
  font-size: 16px;
`;
