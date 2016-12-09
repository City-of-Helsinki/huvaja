import { createSelector, createStructuredSelector } from 'reselect';

function reservationsSelector(state) {
  return state.data.reservations;
}

function resourcesSelector(state) {
  return state.data.resources;
}

function reservationIdSelector(state) {
  return state.modals.reservationInfo.reservationId;
}

function showSelector(state) {
  return state.modals.reservationInfo.show;
}

function unitsSelector(state) {
  return state.data.units;
}


const reservationSelector = createSelector(
  reservationsSelector,
  reservationIdSelector,
  (reservation, id) => reservation[id]
);

const resourceSelector = createSelector(
  resourcesSelector,
  reservationSelector,
  (resources, reservation) => reservation && resources[reservation.resource]
);

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => resource && units[resource.unit]
);

export default createStructuredSelector({
  resource: resourceSelector,
  reservation: reservationSelector,
  reservationId: reservationIdSelector,
  show: showSelector,
  unit: unitSelector,
});
