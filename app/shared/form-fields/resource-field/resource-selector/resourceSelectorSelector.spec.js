import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './resourceSelectorSelector';

describe('shared/form-fields/resource-field/resource-selector/resourceSelectorSelector', () => {
  const resources = {
    'r-1': { id: 'r-1', name: { fi: 'Resource 1' }, peopleCapacity: 10, unit: 'u-2' },
    'r-2': { id: 'r-2', name: { fi: 'Resource 2' }, peopleCapacity: 20, unit: 'u-1' },
    'r-3': { id: 'r-3', name: { fi: 'Resource 3' }, peopleCapacity: 30, unit: 'u-2' },
    'r-4': { id: 'r-3', name: { fi: 'Resource 4' }, peopleCapacity: 40, unit: 'u-1' },
    'r-5': { id: 'r-3', name: { fi: 'Resource 5' }, peopleCapacity: 50, unit: 'u-1' },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };

  const defaultState = {
    activeRequests: { RESOURCES_GET: 1 },
    'data.resources': resources,
    'data.units': units,
    'resourceSelector.availableResourceIds': ['r-1', 'r-2'],
  };

  function getSelected(stateData = defaultState) {
    const state = getState(stateData);
    const props = {
      selectedResourceId: 'r-5',
    };
    return selector(state, props);
  }

  it('returns available resources sorted by label', () => {
    const actual = getSelected();
    const expected = [
      {
        id: 'r-2',
        label: 'Unit 1 / Resource 2',
        peopleCapacity: 20,
      },
      {
        id: 'r-1',
        label: 'Unit 2 / Resource 1',
        peopleCapacity: 10,
      },
    ];
    expect(actual.availableResources).to.deep.equal(expected);
  });

  it('returns unavailable resources sorted by label', () => {
    const actual = getSelected();
    const expected = [
      {
        id: 'r-4',
        label: 'Unit 1 / Resource 4',
        peopleCapacity: 40,
      },
      {
        id: 'r-3',
        label: 'Unit 2 / Resource 3',
        peopleCapacity: 30,
      },
    ];
    expect(actual.unavailableResources).to.deep.equal(expected);
  });

  describe('isFetching', () => {
    it('returns true when RESOURCES_GET is active', () => {
      const actual = getSelected();
      expect(actual.isFetching).to.be.true;
    });

    it('returns false when RESOURCES_GET is not active', () => {
      const state = {
        ...defaultState,
        activeRequests: { RESOURCES_GET: 0 },
      };
      const actual = getSelected(state);
      expect(actual.isFetching).to.be.false;
    });
  });
});
