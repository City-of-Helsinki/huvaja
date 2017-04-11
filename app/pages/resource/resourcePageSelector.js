import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import locationUtils from 'utils/locationUtils';

function resourcesSelector(state) {
  return state.data.resources;
}

function unitsSelector(state) {
  return state.data.units;
}

function resourceIdSelector(state, props) {
  return props.params.id;
}

function beginSelector(state) {
  return state.resourcePage.begin;
}

function resourceSearchUrlSelector(state) {
  return locationUtils.getResourceSearchUrl(state.searchPage.searchFilters);
}

const dateSelector = createSelector(
  beginSelector,
  begin => moment(begin).format('YYYY-MM-DD')
);

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, id) => resources[id]
);

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => resource && units[resource.unit]
);

const isLoadedSelector = createSelector(
  resourceSelector,
  unitSelector,
  (resource, unit) => Boolean(resource && unit)
);

export default createStructuredSelector({
  date: dateSelector,
  isLoaded: isLoadedSelector,
  resource: resourceSelector,
  resourceSearchUrl: resourceSearchUrlSelector,
  unit: unitSelector,
});
