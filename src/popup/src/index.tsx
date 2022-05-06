import '@polkadot/wasm-crypto/initOnlyAsm';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Router } from 'react-chrome-extension-router';
import GlobalStyles from './global.styles';
import { AccountProvider } from 'context/AccountContext';
import { Provider } from 'react-redux';
import { AccountsStore } from 'utils/stores';
import generateStore from 'redux/store';

// cryptoWaitReady().then(async () => {
// const store = await generateStore();
// load all available addresses and accounts
generateStore().then((store) => {
  keyring.loadAll({ ss58Format: 0, type: 'ed25519', store: new AccountsStore() });
  // generateStore.then((store: any) => {
  ReactDOM.render(
    <React.StrictMode>
      <React.StrictMode>
        <Provider store={store}>
          <AccountProvider>
            <Router>
              <GlobalStyles />
              <App />
            </Router>
          </AccountProvider>
        </Provider>
      </React.StrictMode>
    </React.StrictMode>,
    document.getElementById('root')
  );

  reportWebVitals();
});
// });
// });
