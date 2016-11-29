import { CALL_API } from 'redux-api-middleware';

import actionTypes from './actionTypes';

function fetchAuthState() {
  const params = { t: +new Date() };
  return {
    [CALL_API]: {
      types: [
        actionTypes.AUTH_GET_REQUEST,
        actionTypes.AUTH_GET_SUCCESS,
        actionTypes.AUTH_GET_ERROR,
      ],
      endpoint: `/auth?t=${params.t}`,
      method: 'GET',
      credentials: 'include',
    },
  };
}

export {
  fetchAuthState,  // eslint-disable-line import/prefer-default-export
};
