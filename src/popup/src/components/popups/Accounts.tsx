import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import CheckedIcon from 'assets/svgComponents/CheckedIcon';
import TriangleIcon from 'assets/svgComponents/TriangleIcon';
import Button from 'components/primitives/Button';
import { useAccount } from 'context/AccountContext';
import type { KeyringPair } from '@polkadot/keyring/types';
import { Link } from 'react-chrome-extension-router';
import styled from 'styled-components';
import AddImportForBoardedUser from 'pages/AddImportAccount/AddImportForBoardedUser';
import { getAccountImage, truncateString } from 'utils';
import { useDispatch } from 'react-redux';
import { toggleLoading } from 'redux/actions';
import keyring from '@polkadot/ui-keyring';

export default function Accounts() {
  const accountCtx = useAccount();
  const dispatch = useDispatch();
  // todo save in storage
  const [accounts, setAccounts] = useState<KeyringPair[]>(keyring.getPairs());
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const formatName = (name: string) => {
    return name.length > 12 ? truncateString(name) : name;
  };

  const handleSetActiveAccount = (e: React.MouseEvent<HTMLDivElement>, account: unknown) => {
    e.stopPropagation();
    accountCtx.saveActiveAccount(account);
    dispatch(toggleLoading(true));
  };

  return (
    <Container>
      <TriangleContainer>
        <TriangleIcon />
      </TriangleContainer>

      <Header>
        <HeaderItem>ACCOUNTS</HeaderItem>
        <Connected>
          <ConnectedRibbon isConnected={isConnected} />
          {isConnected ? (
            <>
              <HeaderItem>CONNECTED</HeaderItem>
              <MouseOverText>You are connected to app.uniswap.org</MouseOverText>
            </>
          ) : (
            <>
              <HeaderItem>NOT CONNECTED</HeaderItem>
              <MouseOverText width="188px">You are not connected to app.uniswap.org</MouseOverText>
            </>
          )}
        </Connected>
      </Header>

      <AccountsContainer>
        {accounts &&
          accounts.map((account) => {
            return (
              <Account
                onClick={(e) => {
                  handleSetActiveAccount(e, account);
                }}
                key={account.address}>
                <Avatar img={getAccountImage(account.address)} />
                <span>
                  {(account?.meta?.name as string) && formatName(account?.meta?.name as string)}
                </span>

                <Icons>
                  <CheckedIconContainer>
                    {account.address === accountCtx?.getActiveAccount()?.address && (
                      <CheckedIcon width={18} />
                    )}
                  </CheckedIconContainer>
                </Icons>
              </Account>
            );
          })}
      </AccountsContainer>
      <StyledLink component={AddImportForBoardedUser}>
        <Button
          width="100%"
          type="button"
          text="Add / Import Account"
          bgColor="#18191a"
          color="#fff"
          justify={'center'}
          direction={'row-reverse'}
          fontFamily="Inter"
          fontSize="12px"
          height="37px"
          margin="18px 0 0"
          Icon={<PlusIcon width={21} />}
        />
      </StyledLink>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100%;
  width: 100%;
  min-height: 163px;
  padding: 17px 24px 20px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
  position: relative;
  margin: 46px 24px 0;
`;

const TriangleContainer = styled.div`
  position: absolute;
  top: -8px;
  left: 38%;
  transform: translate(-50%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e6e8ec;
  padding-bottom: 10px;
`;

const HeaderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #18191a;
  font-size: 11px;
  font-family: Inter;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.88px;
  use-select: none;
`;
const MouseOverText = styled.p<{ width?: string }>`
  justify-content: center;
  align-items: center;
  padding: 3px 12px;
  border-radius: 5px;
  background-color: #f2f2f2;
  color: #18191a;
  font-family: IBM Plex Sans;
  font-size: 10px;
  display: flex;
  position: absolute;
  min-width: ${({ width }) => width || '171px'};
  top: 24px;
  right: 0;

  ${HeaderItem}: hover ~& {
    display: flex;
  }
`;

const Connected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 50px;
  background-color: #f2f2f2;
  hight: 22px;
  position: relative;
`;

const Avatar = styled.div<{ img: string }>`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ccc;
  background-image: ${({ img }) => `url(${img})`};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`;

const ConnectedRibbon = styled.div<{ isConnected?: boolean }>`
  width: 7.5px;
  height: 7.5px;
  background-color: ${({ isConnected }) => (!isConnected ? '#e6e8ec' : '#68dd65')};
  border-radius: 100%;
  margin-right: 6px;
`;

const AccountsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;

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
  margin: 14px 0 0;
  cursor: pointer;
  span {
    font-family: IBM Plex Sans;
    font-size: 17px;
    font-weight: 500;
    line-height: 23px;
    margin-left: 10px;
    color: #18191a;
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

  span {
    margin: 0 0 0 12px;
  }
`;

const CheckedIconContainer = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 5px;
`;
