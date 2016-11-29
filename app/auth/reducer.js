import { handleActions } from 'redux-actions';

import actionTypes from 'auth/actionTypes';

const initialState = {
  token: null,
  user: null,
};

export default handleActions({
  [actionTypes.AUTH_GET_SUCCESS]: (state, action) => ({
    ...initialState, ...action.payload.auth,
  }),
}, initialState);
