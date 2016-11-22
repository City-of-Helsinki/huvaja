import values from 'lodash/values';
import { createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';

function resourcesSelector(state) {
  return values(state.data.resources);
}

function searchFiltersSelector(state) {
  return state.searchPage.searchFilters;
}

export default createStructuredSelector({
  isFetching: resourcesGetIsActiveSelector,
  resources: resourcesSelector,
  searchFilters: searchFiltersSelector,
});
