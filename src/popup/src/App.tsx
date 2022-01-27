import './App.css';
import ProductIntro from 'pages/ProductIntro/ProductIntro';
import { useAccount } from 'context/AccountContext';
import { getFromChromeStorage, getFromStorage } from 'utils/chrome';
import SignUp from 'pages/SignUp/SignUp';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import Wallet from 'pages/Wallet/Wallet';
import { StorageKeys } from 'utils/types';
import { useEffect } from 'react';
import { MessageListener } from 'utils/messageListener';
import { useDispatch } from 'react-redux';

function App() {
  const account = useAccount();
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      MessageListener(msg, dispatch);
    });

    // todo unsubscribe
  }, []);

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

  return <div className="App">{handlePage()}</div>;
}

export default App;
