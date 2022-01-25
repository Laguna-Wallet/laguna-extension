import { PlusIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import AlternateEmail from 'assets/svgComponents/AlternateEmailIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { goTo, Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { truncateString } from 'utils';
import AddAddress from './AddAddress';

export default function AddressBook() {
  const [isOpen, setOpen] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    // todo proper typing
    const addresses: any[] = [];
    keyring.getAddresses().forEach((address) => {
      const { addressName, memo } = address.meta;
      addresses.push({ address: address.address, addressName, memo });
    });

    setAddresses(addresses);
  }, []);

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        onClose={() => goTo(Wallet)}
        title="Address Book"
      />
      <Content>
        {addresses?.length === 0 ? (
          <>
            <AddressBookContainer>
              <AddressBookIcon />
            </AddressBookContainer>
            <Text>No Addresses</Text>
          </>
        ) : (
          <AddressesContainer>
            {addresses?.map((address) => (
              <StyledLink
                key={address.address}
                component={AddAddress}
                props={{ edit: true, ...address }}>
                <AddressComponent>
                  <Text>
                    {address.addressName}({truncateString(address.address)}){' '}
                  </Text>
                  <AlternateEmail />
                </AddressComponent>
              </StyledLink>
            ))}
          </AddressesContainer>
        )}

        <StyledLink component={AddAddress} props={{ closeAction: () => goTo(AddressBook) }}>
          <Button
            text="Add Address"
            Icon={<PlusIcon width={17} />}
            bgColor="#fff"
            color="#111"
            justify="center"
            margin="auto 0 0 0"
          />
        </StyledLink>
      </Content>
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
  padding: 15px 15px 40px 15px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const StyledLink = styled(Link)`
  text-decoration: none;
  width: 100%;
  margin-top: auto;
`;

const Text = styled.div`
  font-family: SFCompactDisplayRegular;
  font-size: 18px;
  color: #fff;
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
  background-color: #303030;
  color: #fff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
`;
