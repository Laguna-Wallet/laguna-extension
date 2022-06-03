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
import { IdleTimerProvider, useIdleTimerContext } from 'react-idle-timer';
import IdleTimeoutWrapper from 'pages/IdleTimeoutWrapper/IdleTimeoutWrapper';

generateStore().then((store) => {
  // load all available addresses and accounts
  cryptoWaitReady().then(async () => {
    keyring.loadAll({ ss58Format: 42, type: 'sr25519', store: new AccountsStore() });

    ReactDOM.render(
      <React.StrictMode>
        <React.StrictMode>
          <Provider store={store}>
            <IdleTimeoutWrapper>
              <AccountProvider>
                <GlobalStyles />
                <App />
              </AccountProvider>
            </IdleTimeoutWrapper>
          </Provider>
        </React.StrictMode>
      </React.StrictMode>,
      document.getElementById('root')
    );

    reportWebVitals();
  });
});
