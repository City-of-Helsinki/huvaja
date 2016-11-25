import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';

function searchFiltersSelector(state) {
  return state.searchPage.searchFilters;
}

const resourcesSelector = createSelector(
  state => state.data.resources,
  state => state.searchPage.searchResults,
  (resources, resourceIds) => resourceIds.map(id => resources[id])
);

const resultCountSelector = createSelector(
  state => state.searchPage.searchResults,
  resourceIds => resourceIds.length
);

export default createStructuredSelector({
  isFetching: resourcesGetIsActiveSelector,
  resources: resourcesSelector,
  resultsCount: resultCountSelector,
  searchFilters: searchFiltersSelector,
});
