import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { Router } from 'react-chrome-extension-router';
import GlobalStyles from './global.styles';
import { AccountProvider } from 'context/AccountContext';

cryptoWaitReady().then(() => {
  // load all available addresses and accounts
  keyring.loadAll({ ss58Format: 42, type: 'ed25519' });

  ReactDOM.render(
    <React.StrictMode>
      <React.StrictMode>
        <AccountProvider>
          <Router>
            <GlobalStyles />
            <App />
          </Router>
        </AccountProvider>
      </React.StrictMode>
      ,
    </React.StrictMode>,
    document.getElementById('root')
  );

  reportWebVitals();
});
