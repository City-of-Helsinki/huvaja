import { expect } from 'chai';
import moment from 'moment';
import { createAction } from 'redux-actions';

import searchFiltersReducer, { getInitialState, parseUrlFilters } from './searchFiltersReducer';

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

      it('resets state with query parameters', () => {
        const currentState = {
          isFavorite: 'true',
        };
        const payload = {
          query: {
            extra_param: 'true',
            search: 'search text',
          },
        };
        const action = routeChangedAction(payload);
        const nextState = searchFiltersReducer(currentState, action);
        const expected = {
          ...getInitialState(),
          search: 'search text',
        };
        expect(nextState).to.deep.equal(expected);
      });
    });
  });

  describe('parseUrlFilters', () => {
    it('parses regular filters correctly', () => {
      const query = {
        date: '2016-01-01',
        equipment: '123',
        isFavorite: 'true',
      };
      const actual = parseUrlFilters(query);
      expect(actual).to.deep.equal(query);
    });

    it('parses availableBetween correctly', () => {
      const availableStart = moment('2016-01-03 12:00').toISOString();
      const availableEnd = moment('2016-01-04 13:30').toISOString();
      const availableBetween = `${availableStart},${availableEnd}`;
      const query = {
        availableBetween,
        equipment: '123',
      };
      const expected = {
        availableStartDate: '2016-01-03',
        availableStartTime: '12:00',
        availableEndDate: '2016-01-04',
        availableEndTime: '13:30',
        equipment: '123',
      };
      const actual = parseUrlFilters(query);
      expect(actual).to.deep.equal(expected);
    });

    function expectAvailableBetweenIgnored(availableBetween) {
      const actual = parseUrlFilters({ availableBetween });
      expect(actual).to.deep.equal({});
    }

    it('ignores invalid availableBetween', () => {
      const availableStart = moment('2016-01-03 12:00').toISOString();
      expectAvailableBetweenIgnored(undefined);
      expectAvailableBetweenIgnored('');
      expectAvailableBetweenIgnored(`${availableStart}`);
      expectAvailableBetweenIgnored(`${availableStart},`);
      expectAvailableBetweenIgnored(`${availableStart},${availableStart},${availableStart}`);
      expectAvailableBetweenIgnored('invalid,invalid');
    });

    it('ignores params not in initial state', () => {
      const query = {
        date: '2016-01-01',
        extra_param: 'true',
      };
      const actual = parseUrlFilters(query);
      const expected = { date: '2016-01-01' };
      expect(actual).to.deep.equal(expected);
    });
  });
});
