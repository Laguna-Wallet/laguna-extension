import './App.css';
import ProductIntro from 'pages/ProductIntro/ProductIntro';
import { useAccount } from 'context/AccountContext';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
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
import { changeIsLoggedIn } from 'redux/actions';
import { goTo } from 'react-chrome-extension-router';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import RequestToSign from 'pages/RequestToSign';
// import '@polkadot/extension-inject/crossenv';

function App() {
  const account = useAccount();
  const dispatch = useDispatch();
  const { idleTimeout, pendingDappAuthorization, pendingToSign } = useSelector(
    (state: any) => state.wallet
  );

  const { isLoggedIn } = useSelector((state: any) => state.wallet);
  const [loading, setLoading] = useState<boolean>(false);
  const pendingDapps = pendingDappAuthorization?.pendingDappAuthorization;

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      MessageListener(msg, dispatch);
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: Messages.CheckPendingSign });
    chrome.runtime.sendMessage({ type: Messages.CheckPendingDappAuth });
    chrome.runtime.sendMessage({ type: 'AUTH_CHECK' });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === Messages.AuthCheck && !msg.payload.isLoggedIn) {
        const signedIn = getFromStorage(StorageKeys.SignedIn);
        const createdAccount = Boolean(signedIn);

        // if () {
        //   goTo(RequestToSign);
        // }

        if (pendingDapps?.length > 0) {
          goTo(RequestToConnect);
        }

        if (createdAccount) {
          goTo(WelcomeBack);
        } else {
          goTo(SignUp);
        }
      }
    });
  }, []);

  return <div className="App">{handlePage(pendingDapps, pendingToSign)}</div>;
}

export default App;

const handlePage = (pendingDapps: any[], pendingToSign: any) => {
  const createdAccount = Boolean(getFromStorage(StorageKeys.SignedIn));
  const loggedOut = Boolean(getFromStorage(StorageKeys.LoggedOut));
  //todo check for timeout and require password
  // return <WelcomeBack />;

  if (loggedOut) {
    return <WelcomeBack />;
  }

  if (pendingToSign?.pending) {
    return <RequestToSign />;
  }

  if (pendingDapps?.length > 0) {
    return <RequestToConnect />;
  }

  if (createdAccount) {
    return <Wallet />;
  }

  return <SignUp />;
};
