import isEmpty from 'lodash/isEmpty';
import { createSelector, createStructuredSelector } from 'reselect';

import {
  cateringOrderGetIsActiveSelector,
  reservationGetIsActiveSelector,
} from 'api/selectors';
import cateringUtils from 'utils/cateringUtils';

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
  cateringOrderGetIsActiveSelector,
  resourcesSelector,
  (reservationGetIsActive, cateringOrderGetIsActive, resources) => (
    reservationGetIsActive || cateringOrderGetIsActive || isEmpty(resources)
  )
);

function cateringOrdersSelector(state) {
  return state.data.cateringOrders;
}

function reservationCateringOrdersSelector(state) {
  return state.reservationCateringOrders;
}

const cateringOrderSelector = createSelector(
  reservationSelector,
  reservationCateringOrdersSelector,
  cateringOrdersSelector,
  (reservation, reservationCateringOrders, cateringOrders) => {
    const id = reservation && reservationCateringOrders[reservation.id];
    return id && cateringOrders[id];
  }
);

const cateringOrderFormValueSelector = createSelector(
  cateringOrderSelector,
  cateringOrder => (
    cateringOrder && cateringUtils.cateringOrderToFormValue(cateringOrder)
  )
);

export default createStructuredSelector({
  cateringOrder: cateringOrderFormValueSelector,
  isFetching: isFetchingSelector,
  reservation: reservationSelector,
  resource: resourceSelector,
});
