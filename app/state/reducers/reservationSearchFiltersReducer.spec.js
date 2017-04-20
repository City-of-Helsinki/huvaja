import { expect } from 'chai';
import moment from 'moment';
import { createAction } from 'redux-actions';

import reservationSearchFiltersReducer, { getInitialState } from './reservationSearchFiltersReducer';

describe('state/reducers/reservationSearchFiltersReducer', () => {
  describe('initial state', () => {
    function getInitial() {
      return reservationSearchFiltersReducer(undefined, { type: 'NOOP' });
    }

    it('end is the current date plus one month', () => {
      const expected = moment().add(1, 'months').format('YYYY-MM-DD');
      expect(getInitial().end).to.equal(expected);
    });

    it('eventSubject is an empty string', () => {
      expect(getInitial().eventSubject).to.equal('');
    });

    it('hasCatering is an empty string', () => {
      expect(getInitial().hasCatering).to.equal('');
    });

    it('hasEquipment is an empty string', () => {
      expect(getInitial().hasEquipment).to.equal('');
    });

    it('hostName is an empty string', () => {
      expect(getInitial().hostName).to.equal('');
    });

    it('isFavoriteResource is an empty string', () => {
      expect(getInitial().isFavoriteResource).to.equal('');
    });

    it('isOwn is an empty string', () => {
      expect(getInitial().isOwn).to.equal('');
    });

    it('reserverName is an empty string', () => {
      expect(getInitial().reserverName).to.equal('');
    });

    it('resourceName is an empty string', () => {
      expect(getInitial().resourceName).to.equal('');
    });

    it('start is the current date', () => {
      const expected = moment().format('YYYY-MM-DD');
      expect(getInitial().start).to.equal(expected);
    });

    it('unit is an empty string', () => {
      expect(getInitial().unit).to.equal('');
    });
  });

  describe('handling actions', () => {
    describe('CHANGE_RESERVATION_SEARCH_FILTERS', () => {
      const routeChangedAction = createAction('CHANGE_RESERVATION_SEARCH_FILTERS');

      it('sets parameters in payload to filters', () => {
        const currentState = {};
        const payload = {
          start: '2016-12-12',
          is_favorite: '',
        };
        const action = routeChangedAction(payload);
        const nextState = reservationSearchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(payload);
      });

      it('overrides previous values of same filters', () => {
        const payload = {
          start: '2016-12-15',
          isFavorite: 'true',
        };
        const action = routeChangedAction(payload);
        const currentState = {
          start: '2016-12-12',
          isFavorite: '',
        };
        const nextState = reservationSearchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal({
          start: '2016-12-15',
          isFavorite: 'true',
        });
      });
    });

    describe('ENTER_OR_CHANGE_RESERVATION_SEARCH_PAGE', () => {
      const routeChangedAction = createAction('ENTER_OR_CHANGE_RESERVATION_SEARCH_PAGE');

      it('returns current state when payload has query parameters', () => {
        const currentState = {
          isFavorite: 'true',
        };
        const payload = {
          query: {
            is_favorite: '',
          },
        };
        const action = routeChangedAction(payload);
        const nextState = reservationSearchFiltersReducer(currentState, action);
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
        const nextState = reservationSearchFiltersReducer(currentState, action);
        expect(nextState).to.deep.equal(getInitialState());
      });
    });
  });
});
