import { createStructuredSelector } from 'reselect';

function showSelector(state) {
  return state.modals.reservationsRateReport.show;
}

function unitsSelector(state) {
  return state.data.units;
}

function filtersSelector(state) {
  return state.modals.reservationsRateReport.filters;
}

function errorMessageSelector(state) {
  return state.modals.reservationsRateReport.errorMessage;
}

function loadingSelector(state) {
  return state.modals.reservationsRateReport.loading;
}

export default createStructuredSelector({
  show: showSelector,
  units: unitsSelector,
  loading: loadingSelector,
  filters: filtersSelector,
  errorMessage: errorMessageSelector,
});
