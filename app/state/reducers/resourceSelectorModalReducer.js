import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

const initialState = {
  show: false,
};

export default handleActions({
  [uiActions.showResourceSelectorModal]: () => ({ show: true }),
  [uiActions.hideResourceSelectorModal]: () => ({ show: false }),
}, initialState);
