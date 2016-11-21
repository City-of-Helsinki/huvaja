import last from 'lodash/last';

import { getApiActionName, isApiAction } from '../utils';

const initialState = {};

function handleApiCallStart(state, actionName) {
  if (state[actionName]) {
    return Object.assign({}, state, { [actionName]: state[actionName] + 1 });
  }
  return Object.assign({}, state, { [actionName]: 1 });
}

function handleApiCallEnd(state, actionName) {
  if (state[actionName]) {
    return Object.assign({}, state, { [actionName]: state[actionName] - 1 });
  }
  return Object.assign({}, state, { [actionName]: 0 });
}

function activeRequestsReducer(state = initialState, action) {
  if (isApiAction(action.type)) {
    const actionName = getApiActionName(action.type);
    const apiCallState = last(action.type.split('_'));
    if (apiCallState === 'REQUEST') {
      return handleApiCallStart(state, actionName);
    }
    if (apiCallState === 'ERROR' || apiCallState === 'SUCCESS') {
      return handleApiCallEnd(state, actionName);
    }
  }

  return state;
}

export default activeRequestsReducer;
