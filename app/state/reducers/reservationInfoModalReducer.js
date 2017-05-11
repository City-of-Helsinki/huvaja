import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';
import actionTypes from 'api/actionTypes';

const initialState = {
  reservationId: null,
  show: false,
};

const hide = state => ({
  ...state,
  reservationId: null,
  show: false,
});

export default handleActions({
  [uiActions.showReservationInfoModal]: (state, action) => ({
    ...state,
    reservationId: action.payload,
    show: true,
  }),
  [actionTypes.RESERVATION_DELETE_SUCCESS]: hide,
  [uiActions.hideReservationInfoModal]: hide,
  ENTER_OR_CHANGE_RESERVATION_EDIT_PAGE: hide,
}, initialState);
