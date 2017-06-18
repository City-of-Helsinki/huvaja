import actionTypes from './actionTypes';

function createAlwaysResolvingAPIPromise(callback) {
  return function handleAPIAction(apiAction) {
    let resolve;
    const promise = new Promise((res) => {
      resolve = res;
    });
    const actionOptions = {
      errorMeta: { sideEffect: resolve },
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
  createAlwaysResolvingAPIPromise,
  getApiActionName,
  isApiAction,
};
