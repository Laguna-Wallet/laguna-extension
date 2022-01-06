import './App.css';
import ProductIntro from 'pages/ProductIntro/ProductIntro';
import { useAccount } from 'context/AccountContext';
import { getFromStorage } from 'utils/chrome';
import SignUp from 'pages/SignUp/SignUp';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import Wallet from 'pages/Wallet/Wallet';
import { StorageKeys } from 'utils/types';

function App() {
  const account = useAccount();

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
