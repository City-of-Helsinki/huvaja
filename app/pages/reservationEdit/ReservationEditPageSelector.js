import { createSelector, createStructuredSelector } from 'reselect';

function reservationsSelector(state) {
  return state.data.reservations;
}

function reservationIdSelector(state, props) {
  return props.params.id;
}

const reservationSelector = createSelector(
  reservationsSelector,
  reservationIdSelector,
  (reservations, id) => reservations[id]
);

function resourcesSelector(state) {
  return state.data.resources;
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation && reservation.resource
);

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, resourceId) => resources[resourceId]
);

export default createStructuredSelector({
  reservation: reservationSelector,
  resource: resourceSelector,
});
