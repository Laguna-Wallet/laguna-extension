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
import SendToken from './SendToken';

type Props = {
  handleCloseContacts: (address: string) => void;
};

export default function QRPopup({ handleCloseContacts }: Props) {
  const [addresses, setAddresses] = useState<any[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    // todo proper typing
    const addresses: any[] = [];
    keyring.getAddresses().forEach((address) => {
      const { addressName, memo } = address.meta;
      addresses.push({ address: address.address, addressName, memo });
    });

    setAddresses(addresses);
  }, []);

  // todo proper typing
  const handleRenderAssets = (addresses: any[], filterWord: string) => {
    return addresses.filter((address) =>
      address.addressName.toLowerCase().includes(filterWord.toLowerCase())
    );
  };

  return (
    <Container>
      <Header title="Choose Contact" iconStyle="Close" />
      <Content>
        <HumbleInput
          type="text"
          placeholder="search"
          id="search"
          height="40px"
          bgColor="#f3f3f3"
          color="#111"
          value={filter}
          onChange={(e: any) => setFilter(e.target.value)}
        />
        {addresses?.length === 0 ? (
          <>
            <AddressBookContainer>
              <AddressBookIcon />
            </AddressBookContainer>
            <Text>No Addresses</Text>
          </>
        ) : (
          <AddressesContainer>
            {addresses &&
              handleRenderAssets(addresses, filter).map((address) => (
                <AddressComponent onClick={() => handleCloseContacts(address.address)}>
                  <Text>
                    {address.addressName}({truncateString(address.address)}){' '}
                  </Text>
                  <AlternateEmail stroke="#111" />
                </AddressComponent>
              ))}
          </AddressesContainer>
        )}

        <StyledLink component={AddAddress} props={{ BackComponent: SendToken }}>
          <Button
            text="Add Address"
            Icon={<PlusIcon width={17} />}
            bgColor="#e8e8e8"
            borderColor="#e8e8e8"
            color="#111"
            justify="center"
            margin="auto 0 0 0"
          />
        </StyledLink>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  position: relative;
  background-image: ${({ bg }) => `url(${bg})`};
  background-size: cover;
  padding-bottom: 38px;
  padding-top: 180px;
  position: absolute;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
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
  margin-top: 30px;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  margin-top: auto;
`;

const Text = styled.div`
  font-family: 'SFCompactDisplayRegular';
  text-align: center;
  color: #111;
  font-size: 16px;
`;
