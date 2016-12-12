import { expect } from 'chai';
import { createAction } from 'redux-actions';

import cateringReducer from './cateringReducer';

describe('state/reducers/cateringReducer', () => {
  describe('initial state', () => {
    function getInitialState() {
      return cateringReducer(undefined, { type: 'NOOP' });
    }

    it('additionalInfo is an empty string', () => {
      expect(getInitialState().additionalInfo).to.equal('');
    });

    it('order is empty object', () => {
      expect(getInitialState().order).to.deep.equal({});
    });

    it('projectNumber is an empty string', () => {
      expect(getInitialState().projectNumber).to.equal('');
    });

    it('time is an empty string', () => {
      expect(getInitialState().time).to.equal('');
    });
  });

  describe('handling actions', () => {
    describe('SAVE_CATERING_DATA', () => {
      const saveCateringDataAction = createAction('SAVE_CATERING_DATA');

      it('sets payload to state', () => {
        const currentState = {};
        const payload = {
          additionalInfo: 'Some info',
          order: { 'item-1': 12 },
          projectNumber: 'abc123',
          time: '11:15',
        };
        const action = saveCateringDataAction(payload);
        const nextState = cateringReducer(currentState, action);
        expect(nextState).to.deep.equal(payload);
      });

      it('overrides previous values of same filters', () => {
        const payload = {
          additionalInfo: 'Some info',
          order: { 'item-1': 12 },
          projectNumber: 'abc123',
          time: '11:15',
        };
        const action = saveCateringDataAction(payload);
        const currentState = { additionalInfo: 'Old info' };
        const nextState = cateringReducer(currentState, action);
        expect(nextState).to.deep.equal(payload);
      });

      it('use initial reducer state for filters that are not in the payload', () => {
        const payload = { time: '11:15' };
        const action = saveCateringDataAction(payload);
        const currentState = { time: '10:15' };
        const nextState = cateringReducer(currentState, action);
        const expected = {
          additionalInfo: '',
          order: {},
          projectNumber: '',
          time: '11:15',
        };
        expect(nextState).to.deep.equal(expected);
      });
    });

    describe('RESERVATION_POST_SUCCESS', () => {
      const reservationSuccessAction = createAction('RESERVATION_POST_SUCCESS');

      it('resets state', () => {
        const currentState = {
          additionalInfo: 'Some info',
          order: { 'item-1': 12 },
          projectNumber: 'abc123',
          time: '11:15',
        };
        const expected = {
          additionalInfo: '',
          order: {},
          projectNumber: '',
          time: '',
        };
        const action = reservationSuccessAction();
        const nextState = cateringReducer(currentState, action);
        expect(nextState).to.deep.equal(expected);
      });
    });
  });
});
