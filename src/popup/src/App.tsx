import './App.css';
import ProductIntro from 'pages/ProductIntro/ProductIntro';
import { useAccount } from 'context/AccountContext';
import { getFromChromeStorage, getFromStorage, sendMessagePromise } from 'utils/chrome';
import SignUp from 'pages/SignUp/SignUp';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import Wallet from 'pages/Wallet/Wallet';
import { Messages, StorageKeys } from 'utils/types';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { MessageListener } from 'utils/messageListener';
import { useDispatch, useSelector } from 'react-redux';
import { minutesToMilliseconds } from 'date-fns/esm';
import { injectExtension } from '@polkadot/extension-inject';
import keyring from '@polkadot/ui-keyring';
import { changeIsLoggedIn, changeTokenReceived } from 'redux/actions';
import { goTo } from 'react-chrome-extension-router';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import RequestToSign from 'pages/RequestToSign';
import Snackbar from 'components/Snackbar/Snackbar';
import { State } from 'redux/store';
// import '@polkadot/extension-inject/crossenv';
import '@polkadot/wasm-crypto/initOnlyAsm';
import CongratsBackingUp from 'pages/AddImportAccount/CreateAccount/SecureWallet/CongratsBackingUp';

function App() {
  const account = useAccount();
  const dispatch = useDispatch();
  const { idleTimeout, pendingDappAuthorization, pendingToSign, tokenReceived } = useSelector(
    (state: State) => state.wallet
  );

  const { isLoggedIn } = useSelector((state: any) => state.wallet);
  const pendingDapps = pendingDappAuthorization?.pendingDappAuthorization;

  useEffect(() => {
    chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
      MessageListener(msg, dispatch);
      sendResponse({});
    });
  }, []);

  return (
    <div className="App">
      <CongratsBackingUp />
      {/* {handlePage(pendingDapps, pendingToSign)} */}
      <Snackbar
        width="194.9px"
        isOpen={tokenReceived}
        close={() => dispatch(changeTokenReceived({ tokenReceived: false }))}
        message={'Token Received'}
        type="success"
        // left="110px"
        bottom="70px"
      />
    </div>
  );
}

export default App;

const handlePage = (pendingDapps: any[], pendingToSign: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function go() {
      // Login State
      const AuthResponse = await sendMessagePromise({ type: Messages.AuthCheck });

      const PendingDappAuthResponse = await sendMessagePromise({
        type: Messages.CheckPendingDappAuth
      });

      const CheckPendingDappSign = await sendMessagePromise({
        type: Messages.CheckPendingSign
      });

      // If user is not logged in redirect to WelcomeBack or SignUp
      if (!AuthResponse?.payload?.isLoggedIn) {
        const hasBoarded = Boolean(await getFromStorage(StorageKeys.OnBoarding));
        if (hasBoarded) {
          goTo(WelcomeBack);
          return;
        } else {
          goTo(SignUp);
          return;
        }
      }

      // Check if Pending Auth From Dapp(connected site)
      if (
        AuthResponse?.payload?.isLoggedIn &&
        PendingDappAuthResponse?.payload?.pendingDappAuthorization?.length > 0
      ) {
        goTo(RequestToConnect);
        return;
      }

      // Check if Dapp is asking for Sign Transaction(connected site)
      if (AuthResponse?.payload?.isLoggedIn && CheckPendingDappSign?.payload?.pending) {
        goTo(RequestToSign);
        return;
      }

      // in case no pending requests from dapp and user is loggedIn go to Wallet
      if (AuthResponse?.payload?.isLoggedIn) {
        goTo(Wallet);
        return;
      }

      setIsLoading(false);
      return;
    }
    go();
  }, []);

  if (isLoading) {
    <div>Loading</div>;
  }
};
