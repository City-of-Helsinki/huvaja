import filter from 'lodash/filter';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';
import { createSelector, createStructuredSelector } from 'reselect';

import { resourcesGetIsActiveSelector } from 'api/selectors';
import resourceUtils from 'utils/resourceUtils';

const selectedResourceIdSelector = (state, props) => props.selectedResourceId;
const allowedCateringProviderSelector = (state, props) => (
  props.allowedCateringProvider
);
const resourcesSelector = state => state.data.resources;
const unitsSelector = state => state.data.units;
const availableResourceIdsSelector = state => (
  state.resourceSelector.availableResourceIds
);

const allowedCateringUnitsSelector = createSelector(
  allowedCateringProviderSelector,
  (cateringProvider) => {
    if (!cateringProvider) return null;
    const units = {};
    cateringProvider.units.forEach((unitId) => { units[unitId] = true; });
    return units;
  }
);

const unavailableResourceIdsSelector = createSelector(
  resourcesSelector,
  availableResourceIdsSelector,
  (resources, availableIds) => Object.keys(omit(resources, availableIds))
);

const getResources = (ids, resources, units, excludedId, allowedCateringUnits) => {
  const cleaned = filter(ids, id => id !== excludedId);
  return cleaned.map((id) => {
    const resource = resources[id];
    const unit = units[resource.unit];
    const hasBadCateringProvider = Boolean(
      allowedCateringUnits &&
      !allowedCateringUnits[resource.unit]
    );
    return {
      hasBadCateringProvider,
      id,
      label: resourceUtils.getLongName(resource, unit),
      peopleCapacity: resource.peopleCapacity,
    };
  });
};
const availableSelector = createSelector(
  availableResourceIdsSelector,
  resourcesSelector,
  unitsSelector,
  selectedResourceIdSelector,
  allowedCateringUnitsSelector,
  getResources
);
const unavailableSelector = createSelector(
  unavailableResourceIdsSelector,
  resourcesSelector,
  unitsSelector,
  selectedResourceIdSelector,
  allowedCateringUnitsSelector,
  getResources
);

const sort = resources => sortBy(resources, 'label');
const sortedAvailableSelector = createSelector(
  availableSelector,
  availableResources => sort(availableResources)
);
const sortedUnavailableSelector = createSelector(
  unavailableSelector,
  unavailableResources => sort(unavailableResources)
);

const hasTimeSelector = createSelector(
  state => state.form.resourceReservation,
  form => (
    form &&
    form.values.time.begin && form.values.time.begin.time &&
    form.values.time.end && form.values.time.end.time
  )
);
// All resources only shown when no time has been selected
const allResourcesSelector = createSelector(
  hasTimeSelector,
  resourcesSelector,
  unitsSelector,
  selectedResourceIdSelector,
  allowedCateringUnitsSelector,
  (hasTime, resources, units, selectedResourceId, allowedCateringUnits) => (
    hasTime
    ? null
    : sortBy(
      getResources(
        Object.keys(resources),
        resources,
        units,
        selectedResourceId,
        allowedCateringUnits,
      ),
      'label'
    )
  )
);

export default createStructuredSelector({
  availableResources: sortedAvailableSelector,
  isFetching: resourcesGetIsActiveSelector,
  resources: allResourcesSelector,
  unavailableResources: sortedUnavailableSelector,
});
