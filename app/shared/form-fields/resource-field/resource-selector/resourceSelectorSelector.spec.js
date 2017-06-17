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

  function getSelected(stateData = defaultState, extraProps) {
    const state = getState(stateData);
    const props = {
      selectedResourceId: 'r-5',
      ...extraProps,
    };
    return selector(state, props);
  }

  describe('availableResources', () => {
    it('is returned sorted by label', () => {
      const actual = getSelected();
      const expected = [
        {
          hasBadCateringProvider: false,
          id: 'r-2',
          label: 'Unit 1 / Resource 2',
          peopleCapacity: 20,
        },
        {
          hasBadCateringProvider: false,
          id: 'r-1',
          label: 'Unit 2 / Resource 1',
          peopleCapacity: 10,
        },
      ];
      expect(actual.availableResources).to.deep.equal(expected);
    });

    it('can have bad catering provider', () => {
      const props = {
        allowedCateringProvider: { units: ['u-1'] },
      };
      const actual = getSelected(defaultState, props).availableResources.map(
        resource => resource.hasBadCateringProvider
      );
      const expected = [false, true];
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('unavailableResources', () => {
    it('is returned sorted by label', () => {
      const actual = getSelected();
      const expected = [
        {
          hasBadCateringProvider: false,
          id: 'r-4',
          label: 'Unit 1 / Resource 4',
          peopleCapacity: 40,
        },
        {
          hasBadCateringProvider: false,
          id: 'r-3',
          label: 'Unit 2 / Resource 3',
          peopleCapacity: 30,
        },
      ];
      expect(actual.unavailableResources).to.deep.equal(expected);
    });

    it('can have bad catering provider', () => {
      const props = {
        allowedCateringProvider: { units: ['u-1'] },
      };
      const actual = getSelected(defaultState, props).unavailableResources.map(
        resource => resource.hasBadCateringProvider
      );
      const expected = [false, true];
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('resources', () => {
    it('is not returned when time', () => {
      const actual = getSelected({
        'form.resourceReservation.values.time': {
          begin: { date: '2017-01-01', time: '10:00' },
          end: { date: '2017-01-01', time: '11:00' },
        },
      });
      expect(actual.resources).to.be.null;
    });

    it('is returned when no time', () => {
      const actual = getSelected({
        ...defaultState,
        'form.resourceReservation.values.time': {
          begin: { date: '', time: '' },
          end: { date: '', time: '' },
        },
      });
      expect(actual.resources).to.deep.equal([
        {
          hasBadCateringProvider: false,
          id: 'r-2',
          label: 'Unit 1 / Resource 2',
          peopleCapacity: 20,
        },
        {
          hasBadCateringProvider: false,
          id: 'r-4',
          label: 'Unit 1 / Resource 4',
          peopleCapacity: 40,
        },
        {
          hasBadCateringProvider: false,
          id: 'r-1',
          label: 'Unit 2 / Resource 1',
          peopleCapacity: 10,
        },
        {
          hasBadCateringProvider: false,
          id: 'r-3',
          label: 'Unit 2 / Resource 3',
          peopleCapacity: 30,
        },
      ]);
    });

    it('can have bad catering provider', () => {
      const props = {
        allowedCateringProvider: { units: ['u-1'] },
      };
      const actual = getSelected(defaultState, props).resources.map(
        resource => resource.hasBadCateringProvider
      );
      const expected = [false, false, true, true];
      expect(actual).to.deep.equal(expected);
    });
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
