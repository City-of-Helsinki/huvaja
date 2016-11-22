import forEach from 'lodash/forEach';
import get from 'lodash/get';
import merge from 'lodash/merge';
import set from 'lodash/set';

import rootReducer from 'state/reducers';

function getState(extraState = {}) {
  const initialState = rootReducer(undefined, {});
  const newState = {};

  forEach(Object.keys(extraState), (key) => {
    const mergedValue = merge({}, get(initialState, key), extraState[key]);
    set(newState, key, mergedValue);
  });
  return merge({}, initialState, newState);
}

export {
  getState,  // eslint-disable-line import/prefer-default-export
};
