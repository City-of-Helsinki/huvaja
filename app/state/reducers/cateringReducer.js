import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';
import actionTypes from 'api/actionTypes';

const initialState = {
  additionalInfo: '',
  order: {},
  projectNumber: '',
  time: '',
};

export default handleActions({
  [uiActions.saveCateringData]: (state, action) => ({
    ...initialState, ...action.payload,
  }),
  [actionTypes.RESERVATION_POST_SUCCESS]: () => initialState,
}, initialState);
