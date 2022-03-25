import styled from 'styled-components/macro';
import { PlusIcon } from '@heroicons/react/outline';
import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import AlternateEmail from 'assets/svgComponents/AlternateEmailIcon';
import Button from 'components/primitives/Button';
import HumbleInput from 'components/primitives/HumbleInput';
import { useAccount } from 'context/AccountContext';
import AddAddress from 'pages/AddressBook/AddAddress';
import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { Link } from 'react-chrome-extension-router';
import { useSelector } from 'react-redux';
import { truncateString } from 'utils';
import { recodeAddress } from 'utils/polkadot';
import { Prefixes } from 'utils/types';
import Send from './Send';
import SendToken from './SendToken';

type Props = {
  handleClickAccount: (address: string) => void;
  onBack: () => void;
};

export default function AccountsPopup({ handleClickAccount, onBack }: Props) {
  const account = useAccount();
  const [accounts, setAccounts] = useState<any[] | undefined>(undefined);
  const [filter, setFilter] = useState<string>('');
  const { selectedAsset } = useSelector((state: any) => state.sendToken);
  const prefix = Prefixes[selectedAsset.chain];

  const currAccountAddress = account?.getActiveAccount()?.address;
  console.log('~ currAccountAddress', currAccountAddress);

  useEffect(() => {
    // todo proper typing
    const accounts: any[] = [];

    keyring.getPairs().forEach((pair) => {
      if (recodeAddress(pair.address, 0) !== recodeAddress(currAccountAddress, 0)) {
        const { name } = pair.meta;
        accounts.push({ address: pair.address, name });
      }
    });

    setAccounts(accounts);
  }, []);

  // todo proper typing
  const handleRenderAccounts = (accounts: any[], filterWord: string) => {
    return accounts.filter(
      (account) =>
        account.address.toLowerCase().includes(filterWord.toLowerCase()) ||
        account.name.toLowerCase().includes(filterWord.toLowerCase())
    );
  };

  return (
    <Container>
      <Header title="Choose Contact" bgColor="#f2f2f2" iconStyle="LeftArrow" backAction={onBack} />
      <InnerContainer>
        <Content>
          <HumbleInput
            type="text"
            id="search"
            placeholder="Search"
            height="45px"
            bgColor="#f2f2f2"
            placeholderColor="#777e90"
            color="#111"
            value={filter}
            onChange={(e: any) => setFilter(e.target.value)}
          />
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
                handleRenderAccounts(accounts, filter).map((account) => (
                  <AddressComponent
                    key={account.address}
                    onClick={() => handleClickAccount(account.address)}>
                    <Text>
                      {account.name}({truncateString(recodeAddress(account.address, prefix))})
                    </Text>
                    {/* <AlternateEmail stroke="#111" /> */}
                  </AddressComponent>
                ))}
            </AddressesContainer>
          )}
        </Content>
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div<{ bg?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  background-color: #f2f2f2;
  background-size: cover;
  position: absolute;
  padding: 110px 0px 0px 0px;
  box-sizing: border-box;
  top: 0;
  z-index: 100;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px 15px;
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
  background-color: #f2f2f2;
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
  top: 0;
`;

const Text = styled.div`
  font-family: 'SFCompactDisplayRegular';
  text-align: center;
  color: #111;
  font-size: 16px;
`;
