import { handleActions } from 'redux-actions';

function getInitialState() {
  return {
    reservationId: null,
    show: false,
  };
}

export default handleActions({
  SHOW_RESERVATION_INFO_MODAL: (state, action) => ({
    ...state,
    reservationId: action.payload,
    show: true,
  }),
  HIDE_RESERVATION_INFO_MODAL: state => ({
    ...state,
    reservationId: null,
    show: false,
  }),
}, getInitialState());
