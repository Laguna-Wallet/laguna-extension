import './App.css';
import ProductIntro from 'pages/ProductIntro/ProductIntro';
import { useAccount } from 'context/AccountContext';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
import SignUp from 'pages/SignUp/SignUp';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import Wallet from 'pages/Wallet/Wallet';
import { StorageKeys } from 'utils/types';
import { useCallback, useEffect, useRef } from 'react';
import { MessageListener } from 'utils/messageListener';
import { useDispatch, useSelector } from 'react-redux';
import { minutesToMilliseconds } from 'date-fns/esm';
import { injectExtension } from '@polkadot/extension-inject';
import keyring from '@polkadot/ui-keyring';
import { enable } from 'inject/enable';
// import '@polkadot/extension-inject/crossenv';

injectExtension(enable, { name: 'myExtension', version: '1.0.1' });

function App() {
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

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      MessageListener(msg, dispatch);
    });
  }, []);

  const listener = ({ data, source }: any): void => {
    console.log('~ data, source', data, source);
  };

  useEffect(() => {
    const pairs = keyring.getPairs();

    // console.log('~ pairs', pairs);
    // window.addEventListener('message', () => {
    //   console.log('on message');
    // });
    // return () => window.removeEventListener('message', listener);
  }, []);

  return <div className="App">{handlePage()}</div>;
}

chrome.runtime.onMessage.addListener((msg) => {
  console.log('message', msg);
});

export default App;

const handlePage = () => {
  const createdAccount = Boolean(getFromStorage(StorageKeys.SignedIn));
  const loggedOut = Boolean(getFromStorage(StorageKeys.LoggedOut));

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
