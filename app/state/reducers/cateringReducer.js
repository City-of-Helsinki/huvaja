import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

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
}, initialState);
