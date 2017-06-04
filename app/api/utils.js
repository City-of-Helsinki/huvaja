import { SubmissionError } from 'redux-form';

import actionTypes from './actionTypes';

// Proper error handling has not been implemented yet.
function getErrors(action) {
  if (action.type === 'CATERING_ORDER_POST_ERROR') {
    return { _error: 'Tarjoilutilauksen tekeminen epäonnistui.' };
  }
  return { _error: 'Jokin meni pieleen.' };
}

function createAPIPromise(callback) {
  return function handleAPIAction(apiAction) {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    }).catch((action) => {
      throw new SubmissionError(getErrors(action));
    });
    const actionOptions = {
      errorMeta: { sideEffect: reject },
      successMeta: { sideEffect: resolve },
    };
    callback(actionOptions, apiAction);
    return promise;
  };
}

function getApiActionName(actionType) {
  return actionType.split('_').slice(0, -1).join('_');
}

function isApiAction(actionType) {
  return Boolean(actionTypes[actionType]);
}

export {
  createAPIPromise,
  getApiActionName,
  isApiAction,
};
