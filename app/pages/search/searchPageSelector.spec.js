import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const resources = {
    'r-1': { id: 'r-1', unit: 'u-1' },
    'r-2': { id: 'r-2', unit: 'u-2' },
    'r-3': { id: 'r-3', unit: 'u-1' },
    'r-4': { id: 'r-4', unit: 'u-2' },
  };
  const units = {
    'u-1': { id: 'u-1', name: { fi: 'Unit 1' } },
    'u-2': { id: 'u-2', name: { fi: 'Unit 2' } },
  };
  const searchFilters = { date: '2016-12-12', search: 'search text' };
  const searchResults = ['r-1', 'r-2', 'r-3'];

  function getSelected() {
    const state = getState({
      'data.resources': resources,
      'data.units': units,
      'searchPage.searchFilters': searchFilters,
      'searchPage.searchResults': searchResults,
    });
    return searchPageSelector(state);
  }

  it('returns isFetching', () => {
    expect(getSelected().isFetching).to.exist;
  });

  it('returns availabilityGroups corresponding to search results', () => {
    const expected = [
      { name: 'Unit 1', resources: ['r-1', 'r-3'] },
      { name: 'Unit 2', resources: ['r-2'] },
    ];
    expect(getSelected().availabilityGroups).to.deep.equal(expected);
  });

  it('returns searchFilters form the state', () => {
    expect(getSelected().searchFilters).to.deep.equal(searchFilters);
  });

  it('returns resultsCount form the state', () => {
    expect(getSelected().resultsCount).to.deep.equal(searchResults.length);
  });
});
