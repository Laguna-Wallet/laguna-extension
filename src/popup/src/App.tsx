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
import { changeIsLoggedIn, changeTokenReceived } from 'redux/actions';
import { goTo } from 'react-chrome-extension-router';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import RequestToSign from 'pages/RequestToSign';
import Snackbar from 'components/Snackbar/Snackbar';
import { State } from 'redux/store';
// import '@polkadot/extension-inject/crossenv';
import '@polkadot/wasm-crypto/initOnlyAsm';

function App() {
  const account = useAccount();
  const dispatch = useDispatch();
  const { idleTimeout, pendingDappAuthorization, pendingToSign, tokenReceived } = useSelector(
    (state: State) => state.wallet
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

    chrome.runtime.onMessage.addListener(async (msg) => {
      if (msg.type === Messages.AuthCheck && !msg.payload.isLoggedIn) {
        const hasBoarded = Boolean(await getFromStorage(StorageKeys.HasBoarded));

        // if () {
        //   goTo(RequestToSign);
        // }

        if (pendingDapps?.length > 0) {
          goTo(RequestToConnect);
        }

        if (hasBoarded) {
          goTo(WelcomeBack);
        } else {
          goTo(SignUp);
        }
      }
    });
  }, []);

  // useEffect(() => {
  //   let keepAlivePort;
  //   function connect() {
  //     keepAlivePort = chrome.runtime.connect({ name: 'keep_alive' });
  //     keepAlivePort.onDisconnect.addListener(connect);
  //     keepAlivePort.onMessage.addListener((msg) => {
  //       console.log('received', msg, 'from bg');
  //     });
  //   }
  //   connect();
  // }, []);

  return (
    <div className="App">
      {handlePage(pendingDapps, pendingToSign)}
      <Snackbar
        width="194.9px"
        isOpen={tokenReceived}
        close={() => dispatch(changeTokenReceived({ tokenReceived: false }))}
        message={'Token Recieved'}
        type="success"
        // left="110px"
        bottom="70px"
      />
    </div>
  );
}

export default App;

const handlePage = (pendingDapps: any[], pendingToSign: any) => {
  const [accountHasBoarded, setAccountHasBoarded] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    async function go() {
      setAccountHasBoarded(Boolean(await getFromStorage(StorageKeys.HasBoarded)));
      setLoggedOut(Boolean(await getFromStorage(StorageKeys.LoggedOut)));
    }

    go();
  }, []);

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

  if (accountHasBoarded) {
    return <Wallet />;
  }

  return <SignUp />;
};
