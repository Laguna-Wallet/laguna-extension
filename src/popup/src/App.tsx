import './App.css';
import '@polkadot/wasm-crypto/initOnlyAsm';
import browser from 'webextension-polyfill';
import { getFromStorage } from 'utils/chrome';
import { Messages, StorageKeys } from 'utils/types';
import { useEffect, useState } from 'react';
import { MessageListener } from 'utils/messageListener';
import { useDispatch, useSelector } from 'react-redux';
import RequestToSignRaw from 'pages/RequestToSignRaw/RequestToSignRaw';
import { changeTokenReceived } from 'redux/actions';
import Snackbar from 'components/Snackbar/Snackbar';
import { State } from 'redux/store';
import { Route, Switch, useHistory } from 'react-router-dom';
import { router } from 'router/router';
import SignUp from 'pages/SignUp/SignUp';
import WelcomeBack from 'pages/WelcomeBack/WelcomeBack';
import Wallet from 'pages/Wallet/Wallet';
import RequestToConnect from 'pages/RequestToConnect/RequestToConnect';
import RequestToSign from 'pages/RequestToSignTransaction';
import ImportAccount from 'pages/AddImportAccount/ImportAccount/ImportAccount';
import ImportPhase from 'pages/AddImportAccount/ImportAccount/importPhase';
import EncodeAccount from 'pages/AddImportAccount/EncodeAccount';
import CreatePassword from 'pages/AddImportAccount/CreateAccount/CreatePassword/CreatePassword';
import SetupComplete from 'pages/AddImportAccount/SetupComplete';
import AddressBook from 'pages/AddressBook/AddressBook';
import ConnectedSites from 'pages/ConnectedSites/ConnectedSites';
import AutoLockTimer from 'pages/AutoLockTimer/AutoLockTimer';
import ChangePassword from 'pages/ChangePassword/ChangePassword';
import CreateAccount from 'pages/AddImportAccount/CreateAccount/CreateAccount';
import BackupAccount from 'pages/BackupAccount/BackupAccount';
import RemoveAccount from 'pages/RemoveAccount/RemoveAccount';
import Activity from 'pages/Activity/Activity';
import TokenDashboard from 'pages/TokenDashboard/TokenDashboard';
import AddImportForBoardedUser from 'pages/AddImportAccount/AddImportForBoardedUser';
import AddAddress from 'pages/AddressBook/AddAddress';
import Send from 'pages/Send/Send';
import ChainActivity from 'pages/Activity/ChainActivity';
import Receive from 'pages/Recieve/Receive';
import AddRemoveToken from 'pages/AddRemoveToken/AddRemoveToken';
import { fetchAccountsBalances } from 'utils/Api';
import { useAccount } from 'context/AccountContext';
import { getERC20Accounts } from 'utils/ethereumUtils/ethereum';

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const account = useAccount();
  const activeAccount = account.getActiveAccount();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { tokenReceived } = useSelector((state: State) => state.wallet);

  useEffect(() => {
    browser.runtime.onMessage.addListener(async (msg) => {
      MessageListener(msg, dispatch);
    });
  }, []);

  useEffect(() => {
    async function go() {
      fetchAccountsBalances(dispatch);
      getERC20Accounts(dispatch);
    }

    go();
  }, []);

  useEffect(() => {
    async function go() {
      //       // Login State
      const AuthResponse = await browser.runtime.sendMessage({ type: Messages.AuthCheck });

      const PendingDappAuthResponse = await browser.runtime.sendMessage({
        type: Messages.CheckPendingDappAuth
      });

      const CheckPendingDappSign = await browser.runtime.sendMessage({
        type: Messages.CheckPendingSign
      });

      const CheckPendingDappSignRaw = await browser.runtime.sendMessage({
        type: Messages.CheckPendingSignRaw
      });

      //       // If user is not logged in redirect to WelcomeBack or SignUp
      if (!AuthResponse?.payload?.isLoggedIn) {
        const hasBoarded = Boolean(await getFromStorage(StorageKeys.OnBoarding));
        if (hasBoarded) {
          history.push(router.welcomeBack);
        } else {
          history.push(router.signUp);
        }
      }

      // Check if Pending Auth From Dapp(connected site)
      if (
        AuthResponse?.payload?.isLoggedIn &&
        PendingDappAuthResponse?.payload?.pendingDappAuthorization?.length > 0
      ) {
        history.push(router.requestToConnect);
        return;
      }

      // Check if Dapp is asking for Sign Transaction(connected site)
      if (AuthResponse?.payload?.isLoggedIn && CheckPendingDappSign?.payload?.pending) {
        history.push(router.requestToSign);
        return;
      }

      if (AuthResponse?.payload?.isLoggedIn && CheckPendingDappSignRaw?.payload?.pending) {
        history.push(router.requestToSignRaw);
        return;
      }

      // in case no pending requests from dapp and user is loggedIn go to Wallet
      if (AuthResponse?.payload?.isLoggedIn) {
        history.push(router.home);
      }

      setIsLoading(false);
      return;
    }

    go();
  }, []);

  if (isLoading) {
    <div>Loading</div>;
  }

  return (
    <div className="App">
      <Switch>
        <Route path={router.importAccount}>
          <ImportAccount />
        </Route>
        <Route path={router.importPhase}>
          <ImportPhase />
        </Route>
        <Route path={router.encodeAccount}>
          <EncodeAccount />
        </Route>
        <Route path={router.createPassword}>
          <CreatePassword />
        </Route>
        <Route path={router.setupComplete}>
          <SetupComplete />
        </Route>
        <Route path={router.addressBook}>
          <AddressBook />
        </Route>
        <Route path={router.connectedSites}>
          <ConnectedSites />
        </Route>
        <Route path={router.autoLockTimer}>
          <AutoLockTimer />
        </Route>
        <Route path={router.changePassword}>
          <ChangePassword />
        </Route>
        <Route path={router.createAccount}>
          <CreateAccount />
        </Route>
        <Route path={router.backupAccount}>
          <BackupAccount />
        </Route>
        <Route path={router.removeAccount}>
          <RemoveAccount />
        </Route>
        <Route path={router.welcomeBack}>
          <WelcomeBack />
        </Route>
        <Route path={router.signUp}>
          <SignUp />
        </Route>
        <Route path={router.requestToConnect}>
          <RequestToConnect />
        </Route>
        <Route path={router.requestToSign}>
          <RequestToSign />
        </Route>
        <Route path={router.requestToSignRaw}>
          <RequestToSignRaw />
        </Route>
        <Route path={router.activity}>
          <Activity />
        </Route>
        <Route path={router.tokenDashboard}>
          <TokenDashboard />
        </Route>
        <Route path={router.addImportForBoardedUser}>
          <AddImportForBoardedUser />
        </Route>
        <Route path={router.addAddress}>
          <AddAddress />
        </Route>
        <Route path={router.send}>
          <Send />
        </Route>
        <Route path={router.chainActivity}>
          <ChainActivity />
        </Route>
        <Route path={router.receive}>
          <Receive />
        </Route>
        <Route path={router.addRemoveToken}>
          <AddRemoveToken />
        </Route>
        <Route exact path={router.home}>
          <Wallet />
        </Route>
      </Switch>
      <Snackbar
        width="194.9px"
        isOpen={tokenReceived}
        close={() => dispatch(changeTokenReceived({ tokenReceived: false }))}
        message={'New Deposit Received'}
        type="success"
        // left="110px"
        bottom="70px"
      />
    </div>
  );
}

export default App;
