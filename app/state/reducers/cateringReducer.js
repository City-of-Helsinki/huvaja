import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

const initialState = {
  order: {},
};

export default handleActions({
  [uiActions.saveCateringData]: (state, action) => ({
    ...initialState, ...action.payload,
  }),
}, initialState);
