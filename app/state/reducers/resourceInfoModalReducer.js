import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

const initialState = {
  resourceId: null,
  show: false,
};

export default handleActions({
  [uiActions.showResourceInfoModal]: (state, action) => ({
    ...state,
    resourceId: action.payload,
    show: true,
  }),
  [uiActions.hideResourceInfoModal]: state => ({
    ...state,
    resourceId: null,
    show: false,
  }),
}, initialState);
