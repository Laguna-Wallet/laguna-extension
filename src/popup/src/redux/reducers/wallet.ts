export const walletReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'CHANGE_PRICES':
      return { ...state, prices: action.payload.prices };
    case 'CHANGE_INFOS':
      return { ...state, infos: action.payload.infos };
    case 'CHANGE_ACCOUNTS_BALANCES':
      return { ...state, accountsBalances: action.payload.accountsBalances };
    case 'CHANGE_TRANSACTIONS':
      return { ...state, transactions: action.payload.transactions };
    case 'CHANGE_IDLE_TIMEOUT':
      return { ...state, idleTimeout: action.payload.idleTimeout };
    default:
      return state;
  }
};
