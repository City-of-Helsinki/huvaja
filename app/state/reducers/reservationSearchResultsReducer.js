import { handleActions } from 'redux-actions';

import actionTypes from 'api/actionTypes';

const initialState = [];

export default handleActions({
  [actionTypes.RESERVATIONS_GET_SUCCESS]: (state, action) => {
    const reservationIds = Object.keys(action.payload.entities.reservations || {});
    return reservationIds;
  },
  [actionTypes.RESERVATION_DELETE_SUCCESS]: (state, action) => {
    const reservationIds = state.filter(id => id !== String(action.payload.id));
    return reservationIds;
  },
}, initialState);
