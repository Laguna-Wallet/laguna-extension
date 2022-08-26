export const walletReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case "TOGGLE_LOADING":
      return { ...state, loading: action.payload.loading };
    case "CHANGE_PRICES":
      return { ...state, prices: action.payload.prices };
    case "CHANGE_INFOS":
      return { ...state, infos: action.payload.infos };
    case "CHANGE_ACCOUNTS_BALANCES":
      return { ...state, accountsBalances: action.payload.accountsBalances };
    case "CHANGE_TRANSACTIONS":
      return { ...state, transactions: action.payload.transactions };
    case "CHANGE_IDLE_TIMEOUT":
      return { ...state, idleTimeout: action.payload.idleTimeout };
    case "CHANGE_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload.isLoggedIn };
    case "CHANGE_TOKEN_DECIMALS":
      return { ...state, tokenDecimals: action.payload.tokenDecimals };
    case "CHANGE_DAPP_AUTHORIZATION":
      return { ...state, pendingDappAuthorization: action.payload.pendingDappAuthorization };
    case "CHANGE_PENDING_TO_SIGN":
      return { ...state, pendingToSign: action.payload.pendingToSign };
    case "CHANGE_PENDING_TO_SIGN_RAW":
      return { ...state, pendingToSignRaw: action.payload.pendingToSignRaw };
    case "CHANGE_CONNECTED_APPS":
      return { ...state, connectedApps: action.payload.connectedApps };
    case "TOKEN_RECEIVED":
      return { ...state, tokenReceived: action.payload.tokenReceived };
    case "CHANGE_DISABLED_TOKENS":
      return { ...state, disabledTokens: action.payload.disabledTokens };

    default:
      return state;
  }
};
