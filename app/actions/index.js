import { createAction } from 'redux-actions';

import actionTypes from './actionTypes';

const hideReservationInfoModal = createAction(actionTypes.HIDE_RESERVATION_INFO_MODAL);
const showReservationInfoModal = createAction(actionTypes.SHOW_RESERVATION_INFO_MODAL);

export default {
  hideReservationInfoModal,
  showReservationInfoModal,
};
