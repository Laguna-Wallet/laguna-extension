import styled from 'styled-components/macro';
import keyring from '@polkadot/ui-keyring';
import AddressBookIcon from 'assets/svgComponents/AdressBookIcon';
import HumbleInput from 'components/primitives/HumbleInput';
import { useAccount } from 'context/AccountContext';
import Header from 'pages/Wallet/Header';
import Wallet from 'pages/Wallet/Wallet';
import { useEffect, useState } from 'react';
import { goTo } from 'react-chrome-extension-router';
import { useSelector } from 'react-redux';
import { truncateString } from 'utils';
import { recodeAddress } from 'utils/polkadot';
import { Prefixes } from 'utils/types';
import LoopIcon from 'assets/svgComponents/loopIcon';

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
  const currAccountImage = account?.getActiveAccount()?.meta?.img;

  useEffect(() => {
    // todo proper typing
    const accounts: any[] = [];

    keyring.getPairs().forEach((pair) => {
      if (recodeAddress(pair.address, 0) !== recodeAddress(currAccountAddress, 0)) {
        const { name, img } = pair.meta;
        accounts.push({ address: pair.address, name, img });
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
      <Header
        title="SELECT ACCOUNT"
        bgColor="#f2f2f2"
        closeAction={() => goTo(Wallet)}
        iconStyle="LeftArrow"
        smallIcon
        backAction={onBack}
      />
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
            IconAlignment={'left'}
            Icon={<LoopIcon />}
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
                    <IconContainer img={account?.img} />
                    <Text>
                      {truncateString(account.name, 3)}(
                      {truncateString(recodeAddress(account.address, prefix))})
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
  padding: 92px 0px 0px 0px;
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
  padding: 20px 26px;
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
  margin-top: 129px;
  margin-bottom: 16px;
`;

const AddressesContainer = styled.div`
  width: 100%;
  margin-top: 12px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const AddressComponent = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  background-color: #f2f2f2;
  color: #fff;
  border-radius: 4px;
  padding: 16px;
  box-sizing: border-box;
  margin-bottom: 10px;
  cursor: pointer;
`;

const IconContainer = styled.div<{ img: string }>`
  width: 24px;
  height: 24px;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-color: transparent;
  background-position: center center;
  margin-right: 5px;
  border-radius: 100%;
  background-color: #ccc;
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
