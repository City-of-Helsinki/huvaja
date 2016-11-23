import { expect } from 'chai';
import { createAction } from 'redux-actions';

import searchFiltersReducer from './searchFiltersReducer';

describe('state/reducers/searchFiltersReducer', () => {
  describe('initial state', () => {
    const initialState = searchFiltersReducer(undefined, {});

    it('search is an empty string', () => {
      expect(initialState.search).to.equal('');
    });
  });

  describe('handling actions', () => {
    describe('ENTER_OR_CHANGE_SEARCH_PAGE', () => {
      const routeChangedAction = createAction('ENTER_OR_CHANGE_SEARCH_PAGE');

      it('sets query parameters in payload to filters', () => {
        const currentState = {};
        const payload = { query: { search: 'search text' } };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(payload.query);
      });

      it('overrides previous values of same filters', () => {
        const payload = { query: { search: 'search text' } };
        const action = routeChangedAction(payload);
        const currentState = { filter: 'old-value' };
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(payload.query);
      });

      it('use initial reducer state for filters that are not in the payload', () => {
        const payload = { query: { otherFilter: 'some search filter' } };
        const action = routeChangedAction(payload);
        const currentState = { otherFilter: 'some value' };
        const nextState = searchFiltersReducer(currentState, action);
        const expected = { search: '', otherFilter: 'some search filter' };
        expect(nextState).to.deep.equal(expected);
      });
    });
  });
});
