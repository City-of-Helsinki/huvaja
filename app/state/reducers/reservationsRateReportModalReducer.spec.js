import { expect } from 'chai';
import { createAction } from 'redux-actions';

import actionTypes from 'api/actionTypes';
import reservationsRateReportModalReducer from './reservationsRateReportModalReducer';

describe('state/reducers/reservationSearchResultsReducer', () => {
  describe('handling actions', () => {
    describe('RESERVATIONS_RATE_REPORT_GET_REQUEST', () => {
      const request = createAction(actionTypes.RESERVATIONS_RATE_REPORT_GET_REQUEST);

      it('sets correct loading status', () => {
        const action = request();
        const currentState = {
          loading: false,
        };
        const nextState = reservationsRateReportModalReducer(currentState, action);

        expect(nextState.loading).to.be.true;
      });
    });
    describe('RESERVATIONS_RATE_REPORT_GET_SUCCESS', () => {
      const success = createAction(actionTypes.RESERVATIONS_RATE_REPORT_GET_SUCCESS);

      it('sets correct loading status and error message', () => {
        const action = success();
        const currentState = {
          loading: true,
          errorMessage: 'Error X',
        };
        const nextState = reservationsRateReportModalReducer(currentState, action);
        expect(nextState).to.eql({
          loading: false,
          errorMessage: '',
        });
      });
    });
    describe('RESERVATIONS_RATE_REPORT_GET_ERROR', () => {
      const error = createAction(actionTypes.RESERVATIONS_RATE_REPORT_GET_ERROR);
      const payload = {
        response: ['Error X'],
      };
      it('sets correct loading status and error message', () => {
        const action = error(payload);
        const currentState = {
          loading: true,
          errorMessage: '',
        };
        const nextState = reservationsRateReportModalReducer(currentState, action);
        expect(nextState).to.eql({
          loading: false,
          errorMessage: 'Error X',
        });
      });
    });
    describe('RESERVATIONS_RATE_REPORT_GET_ERROR', () => {
      const change = createAction('CHANGE_RESERVATIONS_RATE_REPORT_MODAL_FILTERS');
      const payload = {
        unitSelections: [{
          label: '1', value: 1,
        }],
      };
      it('sets correct filters', () => {
        const action = change(payload);
        const nextState = reservationsRateReportModalReducer({}, action);
        expect(nextState.filters).to.eql(payload);
      });
    });
    describe('SHOW_RESERVATIONS_RATE_REPORT_MODAL', () => {
      const show = createAction('SHOW_RESERVATIONS_RATE_REPORT_MODAL');
      it('sets show to true', () => {
        const nextState = reservationsRateReportModalReducer({}, show());
        expect(nextState.show).to.be.true;
      });
    });
    describe('HIDE_RESERVATIONS_RATE_REPORT_MODAL', () => {
      const show = createAction('HIDE_RESERVATIONS_RATE_REPORT_MODAL');
      it('sets show to false', () => {
        const nextState = reservationsRateReportModalReducer({}, show());
        expect(nextState.show).to.be.false;
      });
    });
  });
});
