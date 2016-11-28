import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';

function searchFiltersSelector(state) {
  return state.searchPage.searchFilters;
}

function unitsSelector(state) {
  return state.data.units;
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

const availabilityGroupsSelector = createSelector(
  resourcesSelector,
  unitsSelector,
  (resources, units) => {
    if (!resources.length || isEmpty(units)) {
      return [];
    }
    const groups = groupBy(resources, resource => resource.unit);
    return Object.keys(groups).map((unitId) => {
      const unit = units[unitId];
      const name = unit.name ? unit.name.fi : '';
      const resourceIds = groups[unitId].map(resource => resource.id);
      return {
        name,
        resources: resourceIds,
      };
    });
  }
);

export default createStructuredSelector({
  availabilityGroups: availabilityGroupsSelector,
  isFetching: resourcesGetIsActiveSelector,
  resultsCount: resultCountSelector,
  searchFilters: searchFiltersSelector,
});
