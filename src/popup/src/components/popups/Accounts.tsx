import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import CheckedIcon from 'assets/svgComponents/CheckedIcon';
import DownArrowIcon from 'assets/svgComponents/DownArrowIcon';
import ExportIcon from 'assets/svgComponents/ExportIcon';
import TriangleIcon from 'assets/svgComponents/TriangleIcon';
import Button from 'components/primitives/Button';
import { useAccount } from 'context/AccountContext';
import CreateAccount from 'pages/CreateAccount/CreateAccount';
import ExportAccount from 'pages/ExportAccount/ExportAccount';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import { getAccounts } from 'utils/polkadot';
import SignUp from 'pages/SignUp/SignUp';
import AddImportForExistingUsers from 'pages/AddImportForExistingUsers/AddImportForExistingUsers';
import { getAccountImage, truncateString } from 'utils';
import { useDispatch } from 'react-redux';
import { changeAccountsBalances, toggleLoading } from 'redux/actions';

type Props = {
  // todo find out proper account typing
  setActiveAccount: (account: any) => void;
};

export default function Accounts({ setActiveAccount }: Props) {
  const accountCtx = useAccount();
  // todo save in storage
  const [accounts, setAccounts] = useState(getAccounts());
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const dispatch = useDispatch();

  const formatName = (name: string) => {
    return name.length > 12 ? truncateString(name) : name;
  };

  const handleSetActiveAccount = (
    e: React.MouseEvent<HTMLDivElement>,
    account: unknown,
    index: number
  ) => {
    e.stopPropagation();
    setActiveAccountIndex(index);
    setActiveAccount(account);
    dispatch(toggleLoading(true));
  };

  return (
    <Container>
      <TriangleContainer>
        <TriangleIcon />
      </TriangleContainer>

      <Header>
        <HeaderItem>ACCOUNTS</HeaderItem>
        <HeaderItem>
          <Connected>
            <ConnectedRibbon />
            <span>CONNECTED</span>
          </Connected>
        </HeaderItem>
        {/* <Tab active={false}>
          <span>all networks</span>
          <DownArrowIcon fill="#fff" />
        </Tab> */}
      </Header>

      <AccountsContainer>
        {accounts &&
          accounts.map((account, index) => {
            return (
              <Account
                onClick={(e) => {
                  handleSetActiveAccount(e, account, index);
                }}
                key={account.address}>
                <Avatar img={getAccountImage(account.address)} />
                <span>{account?.meta?.name && formatName(account?.meta?.name)}</span>

                <Icons>
                  {/* <Link component={ExportAccount} props={{ address: account.address }}>
                    <ExportIcon width={13} />
                  </Link> */}
                  <CheckedIconContainer>
                    {account.address === accountCtx.getActiveAccount().address && (
                      <CheckedIcon width={18} />
                    )}
                  </CheckedIconContainer>
                </Icons>
              </Account>
            );
          })}
      </AccountsContainer>
      <StyledLink component={AddImportForExistingUsers}>
        <Button
          width="260px"
          type="button"
          text="Add / Import Wallet"
          bgColor="#fff"
          color="#111"
          justify={'center'}
          direction={'row-reverse'}
          fontFamily="Sequel100Wide55Wide"
          fontSize="11px"
          Icon={<PlusIcon width={16} />}
        />
      </StyledLink>
    </Container>
  );
}

const Container = styled.div`
  width: 323px;
  min-height: 206px;
  padding: 18px 5px 32px 32px;
  box-sizing: border-box;
  background: #000000;
  border-radius: 5px;
  position: relative;
  margin: auto;
  margin-top: 60px;
`;

const TriangleContainer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate(-50%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #6d6d6d;
  padding-bottom: 14px;
`;

const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 10px;
  font-family: 'Sequel100Wide55Wide';

  /* border-radius: 40px;
  color: #fff;
  font-size: 14px;
  padding: 0 10px;
  cursor: pointer;
  text-transform: capitalize;

  :nth-child(2) {
    width: 152px;
  } */

  span {
    margin-right: 7px;
  }
`;

const Connected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 50px;
  background-color: #2c2c2c;
  padding: 5px 20px;
`;

const Avatar = styled.div<{ img: string }>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ccc;
  background-image: ${({ img }) => `url(${img})`};
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ConnectedRibbon = styled.div`
  width: 5px;
  height: 5px;
  background-color: #68dd65;
  border-radius: 100%;
  margin-right: 5px;
`;

const AccountsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 25px;
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: darkgrey;
    outline: 1px solid slategrey;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  span {
    font-size: 18px;
    color: #fff;
    margin-left: 10px;
    font-family: 'Sequel100Wide55Wide';
  }
`;

const AccountIcon = styled.div`
  display: flex;
  flex-direction: column;
  width: 25px;
  height: 25px;
  background-color: #ccc;
  border-radius: 100%;
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
`;

const StyledLink = styled(Link)`
  width: 260px;
  text-decoration: none;
`;

const CheckedIconContainer = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 5px;
`;
