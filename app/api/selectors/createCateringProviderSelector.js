import find from 'lodash/find';
import values from 'lodash/values';
import { createSelector } from 'reselect';

export default function createCateringProviderSelector(unitIdSelector) {
  return createSelector(
    state => state.data.cateringProviders,
    unitIdSelector,
    (providers, unitId) => find(
      values(providers),
      provider => find(provider.units, id => id === unitId)
    )
  );
}
