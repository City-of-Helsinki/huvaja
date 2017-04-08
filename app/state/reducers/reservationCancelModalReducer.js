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
  [uiActions.showReservationCancelModal]: (state, action) => ({
    ...state,
    reservationId: action.payload,
    show: true,
  }),
  [actionTypes.RESERVATION_DELETE_SUCCESS]: hide,
  [uiActions.hideReservationCancelModal]: hide,
}, initialState);
