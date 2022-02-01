export const walletReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case 'CHANGE_PRICES':
      return { ...state, prices: action.payload.prices };
    case 'CHANGE_INFOS':
      return { ...state, infos: action.payload.infos };
    case 'CHANGE_ACCOUNTS_BALANCES':
      return { ...state, accountsBalances: action.payload.accountsBalances };

    default:
      return state;
  }
};
