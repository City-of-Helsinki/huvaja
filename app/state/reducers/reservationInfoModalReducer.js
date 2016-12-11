import { handleActions } from 'redux-actions';

import uiActions from 'actions/uiActions';

const initialState = {
  reservationId: null,
  show: false,
};

export default handleActions({
  [uiActions.showReservationInfoModal]: (state, action) => ({
    ...state,
    reservationId: action.payload,
    show: true,
  }),
  [uiActions.hideReservationInfoModal]: state => ({
    ...state,
    reservationId: null,
    show: false,
  }),
}, initialState);
