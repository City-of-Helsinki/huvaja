import { expect } from 'chai';
import moment from 'moment';
import { createAction } from 'redux-actions';

import searchFiltersReducer from './searchFiltersReducer';

describe('state/reducers/searchFiltersReducer', () => {
  describe('initial state', () => {
    function getInitialState() {
      return searchFiltersReducer(undefined, { type: 'NOOP' });
    }

    it('date is the current date', () => {
      const expected = moment().format('YYYY-MM-DD');
      expect(getInitialState().date).to.equal(expected);
    });

    it('search is an empty string', () => {
      expect(getInitialState().search).to.equal('');
    });

    it('isFavorite is empty string', () => {
      expect(getInitialState().isFavorite).to.equal('');
    });
  });

  describe('handling actions', () => {
    describe('ENTER_OR_CHANGE_SEARCH_PAGE', () => {
      const routeChangedAction = createAction('ENTER_OR_CHANGE_SEARCH_PAGE');

      it('sets query parameters in payload to filters', () => {
        const currentState = {};
        const payload = {
          query: {
            date: '2016-12-12',
            is_favorite: '',
            search: 'search text',
          },
        };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal({
          date: '2016-12-12',
          isFavorite: '',
          search: 'search text',
        });
      });

      it('overrides previous values of same filters', () => {
        const payload = {
          query: {
            date: '2016-12-12',
            is_favorite: '',
            search: 'search text',
          },
        };
        const action = routeChangedAction(payload);
        const currentState = { search: 'old-value' };
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal({
          date: '2016-12-12',
          isFavorite: '',
          search: 'search text',
        });
      });

      it('use initial reducer state for filters that are not in the payload', () => {
        const payload = { query: { date: '2016-12-12' } };
        const action = routeChangedAction(payload);
        const currentState = { date: '2016-11-11' };
        const nextState = searchFiltersReducer(currentState, action);
        const expected = { isFavorite: '', search: '', date: '2016-12-12' };
        expect(nextState).to.deep.equal(expected);
      });
    });
  });
});
