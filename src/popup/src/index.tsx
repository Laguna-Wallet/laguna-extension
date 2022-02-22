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
import store from 'redux/store';

cryptoWaitReady().then(() => {
  // load all available addresses and accounts
  keyring.loadAll({ ss58Format: 0, type: 'ed25519' });

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
