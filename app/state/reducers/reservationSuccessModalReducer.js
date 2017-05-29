import immutable from 'seamless-immutable';
import { actionTypes as formActions } from 'redux-form';

import apiActionTypes from 'api/actionTypes';

const initialState = immutable({
  created: [],
  edited: null,
  failed: [],
  show: false,
});

function parseError(error) {
  if (error.response && error.response.non_field_errors && error.response.non_field_errors.length) {
    return error.response.non_field_errors.join('. ').replace('[\'', '').replace('\']', '');
  } else if (error.response && error.response.detail) {
    return error.response.detail;
  }
  return 'Jotain meni vikaan';
}

function reservationSuccessModalReducer(state = initialState, action) {
  switch (action.type) {
    case apiActionTypes.RESERVATION_POST_SUCCESS: {
      return state.merge({
        created: [...state.created, action.payload],
        edited: null,
      });
    }
    case apiActionTypes.RESERVATION_POST_ERROR: {
      const reservation = action.meta.reservation;
      if (!reservation) return state;
      const failReason = parseError(action.payload);
      return state.merge({
        failed: [...state.failed, { ...reservation, failReason }],
      });
    }
    case apiActionTypes.RESERVATION_PUT_SUCCESS: {
      return state.merge({
        created: [],
        edited: action.payload,
      });
    }
    case formActions.START_SUBMIT: {
      if (action.meta.form === 'resourceReservation') return initialState;
      return state;
    }
    case 'HIDE_RESERVATION_SUCCESS_MODAL': {
      return initialState;
    }
    case 'SHOW_RESERVATION_SUCCESS_MODAL': {
      return state.merge({
        show: true,
      });
    }
    default: {
      return state;
    }
  }
}

export default reservationSuccessModalReducer;
