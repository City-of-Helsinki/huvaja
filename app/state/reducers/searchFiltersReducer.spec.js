import { expect } from 'chai';
import moment from 'moment';
import { createAction } from 'redux-actions';

import searchFiltersReducer, { getInitialState } from './searchFiltersReducer';

describe('state/reducers/searchFiltersReducer', () => {
  describe('initial state', () => {
    function getInitial() {
      return searchFiltersReducer(undefined, { type: 'NOOP' });
    }

    it('availableStartDate is the current date', () => {
      const expected = moment().format('YYYY-MM-DD');
      expect(getInitial().availableStartDate).to.equal(expected);
    });

    it('availableStartTime is an empty string', () => {
      expect(getInitial().availableStartTime).to.equal('');
    });

    it('availableEndDate is the current date', () => {
      const expected = moment().format('YYYY-MM-DD');
      expect(getInitial().availableEndDate).to.equal(expected);
    });

    it('availableEndTime is an empty string', () => {
      expect(getInitial().availableEndTime).to.equal('');
    });

    it('date is the current date', () => {
      const expected = moment().format('YYYY-MM-DD');
      expect(getInitial().date).to.equal(expected);
    });

    it('search is an empty string', () => {
      expect(getInitial().search).to.equal('');
    });

    it('isFavorite is empty string', () => {
      expect(getInitial().isFavorite).to.equal('');
    });

    it('equipment is empty string', () => {
      expect(getInitial().equipment).to.equal('');
    });

    it('type is empty string', () => {
      expect(getInitial().type).to.equal('');
    });

    it('unit is empty string', () => {
      expect(getInitial().unit).to.equal('');
    });

    it('people is empty string', () => {
      expect(getInitial().people).to.equal('');
    });
  });

  describe('handling actions', () => {
    describe('CHANGE_RESOURCE_SEARCH_FILTERS', () => {
      const routeChangedAction = createAction('CHANGE_RESOURCE_SEARCH_FILTERS');

      it('sets parameters in payload to filters', () => {
        const currentState = {};
        const payload = {
          date: '2016-12-12',
          equipment: '',
          is_favorite: '',
          people: '',
          search: 'search text',
          type: '',
          unit: '',
        };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(payload);
      });

      it('overrides previous values of same filters', () => {
        const payload = {
          date: '2016-12-12',
          isFavorite: '',
          search: 'search text',
        };
        const action = routeChangedAction(payload);
        const currentState = {
          date: '2016-12-12',
          equipment: '',
          isFavorite: '',
          people: '',
          search: 'old-value',
          type: '',
          unit: '',
        };
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal({
          date: '2016-12-12',
          equipment: '',
          isFavorite: '',
          people: '',
          search: 'search text',
          type: '',
          unit: '',
        });
      });
    });

    describe('ENTER_OR_CHANGE_SEARCH_PAGE', () => {
      const routeChangedAction = createAction('ENTER_OR_CHANGE_SEARCH_PAGE');

      it('returns current state when payload has query parameters', () => {
        const currentState = {
          isFavorite: 'true',
        };
        const payload = {
          query: {
            date: '2016-12-12',
            equipment: '',
            is_favorite: '',
            people: '',
            search: 'search text',
            type: '',
            unit: '',
          },
        };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(currentState);
      });

      it('returns initial state when payload has no query parameters', () => {
        const currentState = {
          isFavorite: 'true',
        };
        const payload = {
          query: {},
        };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(getInitialState());
      });
    });
  });
});
