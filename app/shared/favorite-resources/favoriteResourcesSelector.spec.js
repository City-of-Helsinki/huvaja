import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './favoriteResourcesSelector';

describe('shared/favorite-resources/favoriteResourcesSelector', () => {
  const resource1 = {
    id: 'r-1',
    name: { fi: 'R1' },
    isFavorite: true,
    unit: 'u-2',
  };
  const resource2 = {
    id: 'r-2',
    name: { fi: 'R2' },
    isFavorite: false,
    unit: 'u-2',
  };
  const resource3 = {
    id: 'r-3',
    name: { fi: 'R3' },
    isFavorite: true,
    unit: 'u-1',
  };
  const resource4 = {
    id: 'r-4',
    name: { fi: 'R4' },
    isFavorite: true,
    unit: 'u-1',
  };

  const unit1 = {
    id: 'u-1',
    name: { fi: 'U1' },
  };
  const unit2 = {
    id: 'u-2',
    name: { fi: 'U2' },
  };

  function getSelected() {
    const state = getState({
      'data.resources': {
        'r-1': resource1,
        'r-2': resource2,
        'r-3': resource3,
        'r-4': resource4,
      },
      'data.units': {
        'u-1': unit1,
        'u-2': unit2,
      },
    });
    return selector(state);
  }

  it('isFetching is returned', () => {
    expect(getSelected().isFetching).to.be.false;
  });

  describe('resources', () => {
    it('returns favorite resources ordered by long name', () => {
      const actual = getSelected().resources;
      const expected = [
        { id: 'r-3', longName: 'U1 / R3' },
        { id: 'r-4', longName: 'U1 / R4' },
        { id: 'r-1', longName: 'U2 / R1' },
      ];
      expect(actual).to.deep.equal(expected);
    });
  });
});
