import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import AlternateEmail from 'assets/svgComponents/AlternateEmailIcon';
import AddIcon from 'assets/svgComponents/AddIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Button from 'components/primitives/Button';
import Snackbar from 'components/Snackbar/Snackbar';
import { ShowSnackbar } from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { truncateString } from 'utils';
import { useHistory, Link } from 'react-router-dom';
import { router } from 'router/router';

type Props = {
  snackbar?: ShowSnackbar;
};

export default function AddressBook({ snackbar }: Props) {
  const history = useHistory();
  const { location } = history as any;
  const snackbarMsg = snackbar || location?.state?.snackbar;

  const [isOpen, setOpen] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<any[] | undefined>(undefined);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  useEffect(() => {
    // todo proper typing
    const addresses: any[] = [];
    keyring.getAddresses().forEach((address) => {
      const { name, memo } = address.meta;
      addresses.push({ address: address.address, name, memo });
    });

    setAddresses(addresses);
  }, []);

  useEffect(() => {
    if (snackbarMsg?.show) {
      setIsSnackbarOpen(true);
      setSnackbarMessage(snackbarMsg?.message);
    }
  }, []);

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="ADDRESS BOOK"
        onClose={() => history.push(router.home)}
        backAction={() => history.push({ pathname: router.home, state: { isMenuOpen: true } })}
      />

      <Content>
        {addresses?.length === 0 ? (
          <>
            <AddressBookContainer>
              <AddressBookIcon fill="#fff" />
            </AddressBookContainer>
            <Text marginTop="12px">No Addresses</Text>
          </>
        ) : (
          <AddressesContainer>
            {addresses?.map((address) => (
              <StyledLink
                to={{
                  pathname: router.addAddress,
                  state: {
                    edit: true,
                    address: { ...address }
                  }
                }}
                key={address.address}>
                <AddressComponent>
                  <Text>
                    {address.name}({truncateString(address.address)}){' '}
                  </Text>
                  <AlternateEmail />
                </AddressComponent>
              </StyledLink>
            ))}
          </AddressesContainer>
        )}

        <StyledLink to={router.addAddress}>
          <Button
            text="Add Address"
            Icon={<AddIcon />}
            bgColor="#fff"
            color="#111"
            justify="center"
            direction="row-reverse"
            margin="auto 0 0 0"
            marginText="0 12px"
          />
        </StyledLink>
      </Content>

      <Snackbar
        width="194.9px"
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        type="success"
        // left="110px"
        bottom="100px"
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0 17.5px 44px;
  box-sizing: border-box;
  background-color: #111111;
  z-index: 99999;
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 8.5px;
  align-items: center;
  justify-content: center;
`;

const AddressBookContainer = styled.div`
  width: 167px;
  height: 167px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: 68px;
`;

const StyledLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  margin-top: auto;
`;

const Text = styled.div<{ marginTop?: string }>`
  font-family: 'Inter';
  margin-top: ${({ marginTop }) => marginTop};
  font-size: 18px;
  line-height: 35px;
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
