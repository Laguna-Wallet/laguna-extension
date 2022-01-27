import { combineReducers } from 'redux';
import { sendTokenReducer } from './reducers/sendToken';
import { reducer as formReducer } from 'redux-form';
import { walletReducer } from './reducers/wallet';

const rootReducer = combineReducers({
  sendToken: sendTokenReducer,
  wallet: walletReducer,
  form: formReducer
});

export default rootReducer;
