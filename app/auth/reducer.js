import { handleActions } from 'redux-actions';

import actionTypes from 'auth/actionTypes';

const initialState = {
  isFetched: false,
  token: null,
  user: null,
};

export default handleActions({
  [actionTypes.AUTH_GET_SUCCESS]: (state, action) => ({
    ...initialState, ...action.payload.auth, isFetched: true,
  }),
}, initialState);
