import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
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
    const groupedResources = groupBy(resources, resource => resource.unit);
    const groups = Object.keys(groupedResources).map((unitId) => {
      const unit = units[unitId];
      const name = unit.name ? unit.name.fi : '';
      const resourceIds = sortBy(groupedResources[unitId], 'name.fi').map(resource => resource.id);
      return {
        name,
        resources: resourceIds,
      };
    });
    return sortBy(groups, 'name');
  }
);

export default createStructuredSelector({
  availabilityGroups: availabilityGroupsSelector,
  isFetching: resourcesGetIsActiveSelector,
  resultsCount: resultCountSelector,
  searchFilters: searchFiltersSelector,
});
