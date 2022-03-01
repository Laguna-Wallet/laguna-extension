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
import { enable } from 'inject/enable';
import { changeIsLoggedIn } from 'redux/actions';
import { goTo } from 'react-chrome-extension-router';
// import '@polkadot/extension-inject/crossenv';

// injectExtension(enable, { name: 'myExtension', version: '1.0.1' });

function App() {
  // injectExtension(enable, { name: 'myExtension', version: '1.0.1' });
  // this a the function that will be exposed to be callable by the dapp. It resolves a promise
  // with the injected interface, (see `Injected`) when the dapp at `originName` (url) is allowed
  // to access functionality
  // function enableFn(originName: string): any {
  //   console.log('enabled');
  // }

  // injects the extension into the page

  const account = useAccount();
  const dispatch = useDispatch();
  const { idleTimeout } = useSelector((state: any) => state.wallet);
  const { isLoggedIn } = useSelector((state: any) => state.wallet);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      MessageListener(msg, dispatch);
    });
  }, []);

  useEffect(() => {
    // chrome.runtime.sendMessage({ type: 'AUTH_USER' });
  });

  useEffect(() => {
    async function go() {
      chrome.runtime.sendMessage({ type: 'AUTH_CHECK' });
      chrome.runtime.onMessage.addListener(async (msg) => {
        if (msg.type === Messages.AuthCheck && !msg.payload.isLoggedIn) {
          const signedIn = await getFromStorage(StorageKeys.SignedIn);
          const createdAccount = Boolean(signedIn);
          if (createdAccount) {
            goTo(WelcomeBack);
          } else {
            goTo(SignUp);
          }
        }
      });
    }

    go();
  }, []);

  // useEffect(() => {
  //   chrome.runtime.sendMessage({ type: 'AUTH_CHECK' });
  //   chrome.runtime.onMessage.addListener((msg) => {
  //     dispatch(changeIsLoggedIn(msg.payload.isLoggedIn));
  //   });
  // }, []);
  return <div className="App">{handlePage(isLoggedIn)}</div>;
}

// chrome.runtime.onMessage.addListener((msg) => {
//   console.log('message', msg);
// });

export default memo(App);

const handlePage = async (isLoggedIn: boolean) => {
  const createdAccount = Boolean(await getFromStorage(StorageKeys.SignedIn));
  const loggedOut = Boolean(await getFromStorage(StorageKeys.LoggedOut));

  //todo check for timeout and require password
  // return <WelcomeBack />;

  if (loggedOut) {
    return <WelcomeBack />;
  }

  if (createdAccount) {
    return <Wallet />;
  }

  return <SignUp />;
};
