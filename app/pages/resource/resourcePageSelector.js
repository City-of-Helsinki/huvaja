import { createSelector, createStructuredSelector } from 'reselect';

function resourcesSelector(state) {
  return state.data.resources;
}

function unitsSelector(state) {
  return state.data.units;
}

function resourceIdSelector(state, props) {
  return props.params.id;
}

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
  isLoaded: isLoadedSelector,
  resource: resourceSelector,
  unit: unitSelector,
});
