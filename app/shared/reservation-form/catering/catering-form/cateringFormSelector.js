import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

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
  defaultCateringTime: defaultCateringTimeSelector,
  defaultItemQuantity: defaultItemQuantitySelector,
});
