import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import { createCateringProviderSelector } from 'api/selectors';

function defaultCateringTimeSelector(state) {
  const reservationTimes = state.form.resourceReservation.values.time;
  const startTime = reservationTimes.begin.time;
  return startTime || '12:00';
}

function defaultItemQuantitySelector(state) {
  return Number(state.form.resourceReservation.values.numberOfParticipants || 1);
}

function cateringMenuDataSelector(state) {
  return state.data.cateringMenuItems;
}

function resourceIdSelector(state) {
  return state.form.resourceReservation.values.resource;
}

function resourcesSelector(state) {
  return state.data.resources;
}

const unitIdSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, id) => resources[id] && resources[id].unit
);

const cateringMenuProductsSelector = createSelector(
  cateringMenuDataSelector,
  data => data.products,
);

const cateringMenuSelector = createSelector(
  cateringMenuDataSelector,
  data => sortBy(values(data.categories), 'name').map(category => ({
    ...category,
    products: category.products.map(id => data.products[id]),
  })),
);

export default createStructuredSelector({
  cateringData: state => state.catering,
  cateringMenu: cateringMenuSelector,
  cateringMenuItems: cateringMenuProductsSelector,
  cateringProvider: createCateringProviderSelector(unitIdSelector),
  defaultCateringTime: defaultCateringTimeSelector,
  defaultItemQuantity: defaultItemQuantitySelector,
});
