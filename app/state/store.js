import { compose, createStore } from 'redux';

import middleware from './middleware';
import rootReducer from './reducers';

const createStoreWithMiddleware = compose(...middleware)(createStore);

function configureStore(initialState) {
  let store;
  if (process.env.NODE_ENV === 'development') {
    const freezeState = require('redux-freeze-state'); // eslint-disable-line global-require

    store = createStoreWithMiddleware(freezeState(rootReducer), initialState);
  } else {
    store = createStoreWithMiddleware(rootReducer, initialState);
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

export default configureStore();
