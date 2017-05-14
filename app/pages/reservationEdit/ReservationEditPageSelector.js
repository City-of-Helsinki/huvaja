import isEmpty from 'lodash/isEmpty';
import { createSelector, createStructuredSelector } from 'reselect';

import { reservationGetIsActiveSelector } from 'api/selectors';

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

const isFetchingSelector = createSelector(
  reservationGetIsActiveSelector,
  resourcesSelector,
  (reservationGetIsActive, resources) => (
    reservationGetIsActive || isEmpty(resources)
  )
);

export default createStructuredSelector({
  isFetching: isFetchingSelector,
  reservation: reservationSelector,
  resource: resourceSelector,
});
