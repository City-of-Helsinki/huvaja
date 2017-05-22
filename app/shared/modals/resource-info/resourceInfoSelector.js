import { createSelector, createStructuredSelector } from 'reselect';

function resourcesSelector(state) {
  return state.data.resources;
}

function resourceIdSelector(state) {
  return state.modals.resourceInfo.resourceId;
}

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, id) => resources[id]
);

function showSelector(state) {
  return state.modals.resourceInfo.show;
}

function unitsSelector(state) {
  return state.data.units;
}

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => resource && units[resource.unit]
);

export default createStructuredSelector({
  resource: resourceSelector,
  show: showSelector,
  unit: unitSelector,
});
