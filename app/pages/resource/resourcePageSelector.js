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
  (resources, id) => resources[id] || {}
);

const unitSelector = createSelector(
  unitsSelector,
  resourceSelector,
  (units, resource) => units[resource.unit] || {}
);

export default createStructuredSelector({
  resource: resourceSelector,
  unit: unitSelector,
});
