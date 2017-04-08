import { createSelector, createStructuredSelector } from 'reselect';

import { reservationDeleteIsActiveSelector } from 'api/selectors';

function reservationsSelector(state) {
  return state.data.reservations;
}

function reservationIdSelector(state) {
  return state.modals.reservationCancel.reservationId;
}

function showSelector(state) {
  return state.modals.reservationCancel.show;
}

const reservationSelector = createSelector(
  reservationsSelector,
  reservationIdSelector,
  (reservations, reservationId) => reservationId && reservations[reservationId]
);

export default createStructuredSelector({
  isCancelling: reservationDeleteIsActiveSelector,
  reservation: reservationSelector,
  show: showSelector,
});
