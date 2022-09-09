export const sendTokenReducer = (state: any = {}, action: any) => {
  switch (action.type) {
    case "CHANGE_ADDRESS":
      return { ...state, address: action.payload.address };
    case "CHANGE_AMOUNT":
      return { ...state, amount: action.payload.amount };
    case "SELECT_ASSET":
      return { ...state, selectedAsset: action.payload.selectedAsset };
    case "SELECT_ASSET_TOKEN":
      return { ...state, selectedAssetToken: action.payload.selectedAssetToken };
    case "SET_BLOCK_HASH":
      return { ...state, blockHash: action.payload.blockHash };
    default:
      return state;
  }
};
