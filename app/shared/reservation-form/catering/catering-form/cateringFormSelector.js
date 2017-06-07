import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import { formValueSelector } from 'redux-form';
import { createSelector, createStructuredSelector } from 'reselect';

import { createCateringProviderSelector } from 'api/selectors';

function reservationFormCateringOrderSelector(state) {
  return state.form.resourceReservation.values.cateringOrder || {};
}

function defaultServingTimeSelector(state) {
  const reservationTimes = state.form.resourceReservation.values.time;
  const startTime = reservationTimes.begin.time;
  return startTime || '12:00';
}

function defaultItemQuantitySelector(state) {
  return Number(state.form.resourceReservation.values.numberOfParticipants || 1);
}

function resourceIdSelector(state) {
  return state.form.resourceReservation.values.resource;
}

function resourcesSelector(state) {
  return state.data.resources;
}

function cateringProductsSelector(state) {
  return state.data.cateringProducts;
}

function cateringCategoriesSelector(state) {
  return state.data.cateringProductCategories;
}

const unitIdSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, id) => resources[id] && resources[id].unit
);

const cateringProviderSelector = createCateringProviderSelector(unitIdSelector);

const providerCategoriesSelector = createSelector(
  cateringProviderSelector,
  cateringCategoriesSelector,
  (provider, categories) =>
    values(categories).filter(category => category.provider === provider.id)
);

const cateringMenuSelector = createSelector(
  providerCategoriesSelector,
  cateringProductsSelector,
  (categories, products) =>
    sortBy(categories, 'name.fi').map(category => ({
      ...category,
      products: category.products.map(id => products[id]),
    }))
);

const initialValuesSelector = createSelector(
  reservationFormCateringOrderSelector,
  defaultServingTimeSelector,
  (reservationFormValues, servingTime) => ({
    invoicingData: reservationFormValues.invoicingData || '',
    message: reservationFormValues.message || '',
    order: reservationFormValues.order || {},
    servingTime,
  })
);

const valuesSelector = state => formValueSelector('catering')(
  state, 'invoicingData', 'message', 'order', 'servingTime'
);

export default createStructuredSelector({
  cateringMenu: cateringMenuSelector,
  cateringMenuItems: cateringProductsSelector,
  cateringProvider: createCateringProviderSelector(unitIdSelector),
  defaultItemQuantity: defaultItemQuantitySelector,
  formValues: valuesSelector,
  initialValues: initialValuesSelector,
});
