import actionTypes from './actionTypes';

function getApiActionName(actionType) {
  return actionType.split('_').slice(0, -1).join('_');
}

function isApiAction(actionType) {
  return Boolean(actionTypes[actionType]);
}

export {
  getApiActionName,
  isApiAction,
};
