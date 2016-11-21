import { createSelector } from 'reselect';

import { getApiActionName } from '../utils';

function activeRequestsSelector(state) {
  return state.activeRequests;
}

function createRequestIsActiveSelector(actionType) {
  return createSelector(
    activeRequestsSelector,
    activeRequests => Boolean(activeRequests[getApiActionName(actionType)])
  );
}

export default createRequestIsActiveSelector;
