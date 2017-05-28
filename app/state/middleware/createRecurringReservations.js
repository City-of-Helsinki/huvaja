import actionTypes from 'api/actionTypes';
import { makeReservation } from 'api/actions/reservations';

function create(action, store) {
  action.meta.recurringReservations.forEach((instance) => {
    const data = {
      ...action.meta.reservationData,
      begin: instance.begin,
      end: instance.end,
    };
    const options = {
      errorMeta: {
        reservation: { ...data },
      },
    };
    const makeInstance = makeReservation(data, options);
    store.dispatch(makeInstance);
  });
}

const createRecurringReservations = store => dispatch => (action) => {
  if (
    action.type === actionTypes.RESERVATION_POST_SUCCESS &&
    action.meta &&
    action.meta.recurringReservations
  ) {
    window.setTimeout(
      () => create(action, store),
      0
    );
  }
  return dispatch(action);
};
export default createRecurringReservations;
