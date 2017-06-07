import sortBy from 'lodash/sortBy';
import { createSelector, createStructuredSelector } from 'reselect';

import {
  cateringProductCategoriesGetIsActiveSelector,
  cateringProductsGetIsActiveSelector,
  cateringProvidersGetIsActiveSelector,
  createCateringProviderSelector,
} from 'api/selectors';

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

function cateringOrdersSelector(state) {
  return state.data.cateringOrders;
}

function reservationCateringOrdersSelector(state) {
  return state.reservationCateringOrders;
}

function cateringProductsSelector(state) {
  return state.data.cateringProducts;
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

const unitIdSelector = createSelector(
  resourceSelector,
  resource => resource && resource.unit
);

const unitSelector = createSelector(
  unitsSelector,
  unitIdSelector,
  (units, unitId) => units[unitId]
);

const cateringOrderSelector = createSelector(
  reservationSelector,
  reservationCateringOrdersSelector,
  cateringOrdersSelector,
  (reservation, reservationCateringOrders, cateringOrders) => {
    const id = reservation && reservationCateringOrders[reservation.id];
    return id && cateringOrders[id];
  }
);

const cateringProviderSelector = createCateringProviderSelector(unitIdSelector);

const cateringProductsMissingSelector = createSelector(
  cateringOrderSelector,
  cateringProductsSelector,
  (cateringOrder, products) => {
    if (!cateringOrder) return false;
    for (const line of cateringOrder.orderLines) {
      if (!products[line.product]) return true;
    }
    return false;
  }
);

const cateringOrderItemsSelector = createSelector(
  cateringProductsMissingSelector,
  cateringOrderSelector,
  cateringProductsSelector,
  (productsMissing, cateringOrder, cateringMenuItems) => {
    if (!cateringOrder || productsMissing) return [];
    const lines = cateringOrder.orderLines.map(line => ({
      ...cateringMenuItems[line.product],
      quantity: line.quantity,
    }));
    return sortBy(lines, 'name');
  }
);

const isFetchingCateringData = createSelector(
  cateringProductCategoriesGetIsActiveSelector,
  cateringProductsGetIsActiveSelector,
  cateringProvidersGetIsActiveSelector,
  (isFetchingCategories, isFetchingProducts, isFetchingProviders) => (
    isFetchingCategories || isFetchingProducts || isFetchingProviders
  )
);

const shouldFetchCateringDataSelector = createSelector(
  cateringProductsMissingSelector,
  isFetchingCateringData,
  (missing, isFetching) => missing && !isFetching
);

export default createStructuredSelector({
  cateringOrder: cateringOrderSelector,
  cateringOrderItems: cateringOrderItemsSelector,
  cateringProvider: cateringProviderSelector,
  resource: resourceSelector,
  reservation: reservationSelector,
  reservationId: reservationIdSelector,
  shouldFetchCateringData: shouldFetchCateringDataSelector,
  show: showSelector,
  unit: unitSelector,
});
