import { useEffect, useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import ShareIcon from 'assets/svgComponents/ShareIcon';
import MenuHeader from 'components/MenuHeader/MenuHeader';
import Snackbar from 'components/Snackbar/Snackbar';
import { useAccount } from 'context/AccountContext';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Messages, SnackbarMessages } from 'utils/types';
import { useHistory } from 'react-router-dom';
import { router } from 'router/router';
import browser from 'webextension-polyfill';
import RevokeIcon from 'assets/svgComponents/RevokeIcon';
import Button from 'components/primitives/Button';
import { useDispatch } from 'react-redux';
import { changeConnectedApps } from 'redux/actions';

// todo proper typing
type Props = {
  handleSubmit?: any;
};

function ConnectedSites({ handleSubmit }: Props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isOpen, setOpen] = useState<boolean>(true);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const account = useAccount();
  const activeAccount = account.getActiveAccount();

  const { connectedApps } = useSelector((state: any) => state.wallet);

  useEffect(() => {
    browser.runtime.sendMessage({
      type: Messages.ConnectedApps
    });
  }, []);

  const handleRevoke = (dappName: string) => {
    browser.runtime.sendMessage({ type: Messages.RevokeDapp, payload: { dappName } });
    setIsSnackbarOpen(true);
    setSnackbarMessage(SnackbarMessages.AccessRevoked);
  };

  const handleDisconnectAllSites = () => {
    dispatch(changeConnectedApps([] as any));
    browser.runtime.sendMessage({ type: Messages.DisconnectAllSites });
  };

  return (
    <Container>
      <MenuHeader
        isOpen={isOpen}
        setOpen={setOpen}
        title="CONNECTED SITES"
        onClose={() => history.push(router.home)}
        backAction={() => {
          history.push({ pathname: router.home, state: { isMenuOpen: true } });
        }}
      />

      <Content>
        {connectedApps?.connectedApps?.length && (
          <HeroText>
            &rsquo;&rsquo;{activeAccount?.meta?.name}&rsquo;&rsquo; is connected to these sites.
            They can view your account address
          </HeroText>
        )}
        {connectedApps?.connectedApps?.length ? (
          connectedApps?.connectedApps.map((item: string, index: number) => (
            <ConnectedAppItem key={`${item}-${index}`}>
              {/* <CheckIcon width={25} height={25} stroke="#68dd65" /> */}
              <AppName>{item}</AppName>
              <RevokeIconContainer onClick={() => handleRevoke(item)}>
                <RevokeIcon />
              </RevokeIconContainer>
              {/* <RevokeBtn onClick={() => handleRevoke(item)}>Revoke</RevokeBtn> */}
            </ConnectedAppItem>
          ))
        ) : (
          <>
            <IconContainer>
              <ShareIcon />
            </IconContainer>
            <Text>No Trusted Apps</Text>
          </>
        )}

        {connectedApps?.connectedApps?.length && (
          <Button
            margin="auto 0px 0px 0px"
            text="Disconnect all sites"
            color="#111"
            bgColor="#fff"
            justify="center"
            onClick={handleDisconnectAllSites}
          />
        )}
      </Content>
      <Snackbar
        width="194.9px"
        isOpen={isSnackbarOpen}
        close={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        type="success"
        // left="110px"
        bottom="50px"
      />
    </Container>
  );
}

export default ConnectedSites;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  padding: 0px 17.5px 40px;
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
  margin-top: 10px;
`;

const HeroText = styled.div`
  font-size: 16px;
  font-weight: 400;
  font-family: Inter;
  line-height: 20px;
  color: #fff;
  margin-bottom: 15px;
`;

const ConnectedAppItem = styled.div`
  width: 100%;
  height: 48px;
  padding: 9px 11px 10px 12px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #303030;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
`;

const AppName = styled.div`
  color: #fff;
  font-size: 16px;
  margin-left: 5px;
`;

// const RevokeBtn = styled.div`
//   width: 74px;
//   height: 29px;
//   border-radius: 4px;
//   background-color: #fb5a5a;
//   padding: 10px;
//   box-sizing: border-box;
//   color: #fff;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `;

const RevokeIconContainer = styled.div`
  margin-left: auto;
  cursor: pointer;
`;

const IconContainer = styled.div`
  width: 167px;
  height: 167px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #000;
  margin-top: 64px;
`;

const Text = styled.div`
  font-size: 18px;
  line-height: 1.35;
  margin-top: 11.7px;
  font-family: Inter;
  color: #fff;
`;
