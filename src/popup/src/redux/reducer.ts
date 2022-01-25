import { combineReducers } from 'redux';
import { sendTokenReducer } from './reducers/SendToken';

const rootReducer = combineReducers({
  sendToken: sendTokenReducer
});

export default rootReducer;
