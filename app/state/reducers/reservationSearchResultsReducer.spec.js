import keyBy from 'lodash/keyBy';
import { expect } from 'chai';
import { createAction } from 'redux-actions';

import actionTypes from 'api/actionTypes';
import reservationSearchResultsReducer from './reservationSearchResultsReducer';

describe('state/reducers/reservationSearchResultsReducer', () => {
  describe('initial state', () => {
    function getInitialState() {
      return reservationSearchResultsReducer(undefined, { type: 'NOOP' });
    }

    it('is an empty array', () => {
      expect(getInitialState()).to.deep.equal([]);
    });
  });

  describe('handling actions', () => {
    describe('RESERVATIONS_GET_SUCCESS', () => {
      const getReservationsSuccess = createAction(
        actionTypes.RESERVATIONS_GET_SUCCESS,
        reservations => ({
          entities: {
            reservations: keyBy(reservations, 'id'),
          },
        })
      );
      const reservations = [
        { id: 'r-1', foo: 'bar' },
        { id: 'r-2', foo: 'bar' },
      ];

      it('sets the given reservation ids to state', () => {
        const action = getReservationsSuccess(reservations);
        const currentState = [];
        const expected = [reservations[0].id, reservations[1].id];
        const nextState = reservationSearchResultsReducer(currentState, action);

        expect(nextState).to.deep.equal(expected);
      });

      it('replaces the old ids in state', () => {
        const action = getReservationsSuccess(reservations);
        const currentState = ['r-99'];
        const expected = [reservations[0].id, reservations[1].id];
        const nextState = reservationSearchResultsReducer(currentState, action);

        expect(nextState).to.deep.equal(expected);
      });
    });
  });
});
