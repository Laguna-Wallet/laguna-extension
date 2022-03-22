import { PlusIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import AlternateEmail from 'assets/svgComponents/AlternateEmailIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import AddAddress from 'pages/AddressBook/AddAddress';
import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { truncateString } from 'utils';
import Send from './Send';
import SendToken from './SendToken';

type Props = {
  handleCloseContacts: (address: string) => void;
  onBack: () => void;
};

export default function ContactsPopup({ handleCloseContacts, onBack }: Props) {
  const [accounts, setAccounts] = useState<any[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState<boolean>(false);

  useEffect(() => {
    // todo proper typing
    const accounts: any[] = [];
    keyring.getAddresses().forEach((account) => {
      const { addressName, memo } = account.meta;
      accounts.push({ address: account.address, name: addressName, memo });
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
      <Header title="Contact" bgColor="#f2f2f2" iconStyle="LeftArrow" backAction={onBack} />
      <InnerContainer>
        <Content>
          {accounts && accounts?.length > 0 && (
            <HumbleInput
              type="text"
              placeholder="Search"
              id="search"
              height="45px"
              bgColor="#f2f2f2"
              placeholderColor="#777e90"
              color="#111"
              value={filter}
              onChange={(e: any) => setFilter(e.target.value)}
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
                    <AlternateEmail stroke="#111" />
                  </AddressComponent>
                ))}
            </AddressesContainer>
          )}

          <Button
            text="Add Address"
            Icon={<PlusIcon width={17} />}
            bgColor="#e8e8e8"
            borderColor="#e8e8e8"
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
