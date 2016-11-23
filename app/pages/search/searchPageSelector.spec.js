import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import searchPageSelector from './searchPageSelector';

describe('pages/search/searchPageSelector', () => {
  const resources = {
    'r-1': { id: 'r-1' },
    'r-2': { id: 'r-2' },
  };
  const searchFilters = { search: 'search text' };
  const state = getState({
    'data.resources': resources,
    'searchPage.searchFilters': searchFilters,
  });
  const selected = searchPageSelector(state);

  it('returns isFetching', () => {
    expect(selected.isFetching).to.exist;
  });

  it('returns resources in an array form the state', () => {
    const expected = [resources['r-1'], resources['r-2']];
    expect(selected.resources).to.deep.equal(expected);
  });

  it('returns searchFilters form the state', () => {
    expect(selected.searchFilters).to.deep.equal(searchFilters);
  });
});
