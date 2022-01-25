import { createStore, Store } from 'redux';
import rootReducer from './reducer';

// todo inject redux dev tools
const store: Store<any, any> = createStore(
  rootReducer
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) as any;

export default store;
