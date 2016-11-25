import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const resources = {
    'r-1': { id: 'r-1' },
    'r-2': { id: 'r-2' },
    'r-3': { id: 'r-3' },
  };
  const searchFilters = { date: '2016-12-12', search: 'search text' };
  const searchResults = ['r-1', 'r-3'];

  function getSelected() {
    const state = getState({
      'data.resources': resources,
      'searchPage.searchFilters': searchFilters,
      'searchPage.searchResults': searchResults,
    });
    return searchPageSelector(state);
  }

  it('returns isFetching', () => {
    expect(getSelected().isFetching).to.exist;
  });

  it('returns resources corresponding to search results', () => {
    const expected = [resources['r-1'], resources['r-3']];
    expect(getSelected().resources).to.deep.equal(expected);
  });

  it('returns searchFilters form the state', () => {
    expect(getSelected().searchFilters).to.deep.equal(searchFilters);
  });

  it('returns resultsCount form the state', () => {
    expect(getSelected().resultsCount).to.deep.equal(searchResults.length);
  });
});
