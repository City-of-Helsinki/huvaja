import { expect } from 'chai';

import searchFiltersReducer from './searchFiltersReducer';

describe('state/reducers/searchFiltersReducer', () => {
  describe('initial state', () => {
    const initialState = searchFiltersReducer(undefined, {});

    it('query is an empty string', () => {
      expect(initialState.query).to.equal('');
    });
  });
});
