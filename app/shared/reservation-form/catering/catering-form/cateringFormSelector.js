import moment from 'moment';
import { createStructuredSelector } from 'reselect';

function defaultCateringTimeSelector(state) {
  const reservationTimes = state.form.resourceReservation.values.time;
  return reservationTimes ? moment(reservationTimes.begin).format('HH:mm') : '12:00';
}

function defaultItemQuantitySelector(state) {
  return Number(state.form.resourceReservation.values.numberOfParticipants || 1);
}

export default createStructuredSelector({
  cateringData: state => state.catering,
  cateringMenuItems: state => state.data.cateringMenuItems,
  defaultCateringTime: defaultCateringTimeSelector,
  defaultItemQuantity: defaultItemQuantitySelector,
});
