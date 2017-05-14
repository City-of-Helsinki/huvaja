import { createSelector, createStructuredSelector } from 'reselect';

const selectedResourceSelector = (state, props) => props.selectedResource;
const showSelector = state => state.modals.resourceSelector.show;
const unitsSelector = state => state.data.units;
const unitSelector = createSelector(
  selectedResourceSelector,
  unitsSelector,
  (resource, units) => units[resource && resource.unit]
);

export default createStructuredSelector({
  selectedResource: selectedResourceSelector,
  show: showSelector,
  unit: unitSelector,
});
