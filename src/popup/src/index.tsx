// import "@polkadot/wasm-crypto/initOnlyAsm";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import keyring from "@polkadot/ui-keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import GlobalStyles from "./global.styles";
import { AccountProvider } from "context/AccountContext";
import { Provider } from "react-redux";
import { AccountsStore } from "utils/stores";
import generateStore from "redux/store";
import { IdleTimerProvider, useIdleTimerContext } from "react-idle-timer";
import IdleTimeoutWrapper from "pages/IdleTimeoutWrapper/IdleTimeoutWrapper";
import { getEVMHistoricalTransactions } from "utils/evm/api";
import { EVMNetwork, EVMAssetId } from "networks/evm";

generateStore().then((store) => {
  // load all available addresses and accounts
  cryptoWaitReady().then(async () => {
    keyring.loadAll({ ss58Format: 42, type: "sr25519", store: new AccountsStore() });
    console.log(
      "txns",
      await getEVMHistoricalTransactions(
        "0x6e70d24832511dffd2cab529913ab54433e9abd9",
        EVMNetwork.ETHEREUM,
        EVMAssetId.ETHEREUM_USDT,
      ),
    );
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <IdleTimeoutWrapper>
            <AccountProvider>
              <GlobalStyles />
              <HashRouter>
                <App />
              </HashRouter>
            </AccountProvider>
          </IdleTimeoutWrapper>
        </Provider>
      </React.StrictMode>,
      document.getElementById("root"),
    );

    reportWebVitals();
  });
});
