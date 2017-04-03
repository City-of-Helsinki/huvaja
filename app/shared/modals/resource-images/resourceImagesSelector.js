import { createSelector, createStructuredSelector } from 'reselect';

function resourcesSelector(state) {
  return state.data.resources;
}

function resourceIdSelector(state) {
  return state.modals.resourceImages.resourceId;
}

function showSelector(state) {
  return state.modals.resourceImages.show;
}

const resourceSelector = createSelector(
  resourcesSelector,
  resourceIdSelector,
  (resources, resourceId) => resourceId && resources[resourceId]
);

export default createStructuredSelector({
  resource: resourceSelector,
  show: showSelector,
});
