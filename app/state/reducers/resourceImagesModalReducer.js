import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

const initialState = {
  resourceId: null,
  show: false,
};

export default handleActions({
  [uiActions.showResourceImagesModal]: (state, action) => ({
    ...state,
    resourceId: action.payload,
    show: true,
  }),
  [uiActions.hideResourceImagesModal]: state => ({
    ...state,
    resourceId: null,
    show: false,
  }),
}, initialState);
