import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import values from 'lodash/values';
import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';
import resourceUtils from 'utils/resourceUtils';

function resourcesSelector(state) {
  return state.data.resources;
}

function unitsSelector(state) {
  return state.data.units;
}

const favoriteSelector = createSelector(
  resourcesSelector,
  resources => filter(values(resources), 'isFavorite')
);

const favoriteResourcesSelector = createSelector(
  favoriteSelector,
  unitsSelector,
  (resources, units) => resources.map((resource) => {
    const unit = units[resource.unit];
    return {
      id: resource.id,
      longName: resourceUtils.getLongName(resource, unit),
    };
  })
);

const orderedFavoriteResourcesSelector = createSelector(
  favoriteResourcesSelector,
  resources => orderBy(resources, 'longName')
);

export default createStructuredSelector({
  isFetching: resourcesGetIsActiveSelector,
  resources: orderedFavoriteResourcesSelector,
});
