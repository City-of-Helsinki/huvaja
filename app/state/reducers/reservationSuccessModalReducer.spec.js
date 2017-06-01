import { expect } from 'chai';
import immutable from 'seamless-immutable';

import reducer from './reservationSuccessModalReducer';

describe('state/reducers/reservationSuccessModalReducer', () => {
  const initialState = {
    created: [],
    edited: null,
    failed: [],
    show: false,
  };

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('RESERVATION_POST_SUCCESS', () => {
    it('adds payload to created reservations', () => {
      const state = immutable({
        created: [{ id: 'r1' }],
      });
      const actual = reducer(state, {
        type: 'RESERVATION_POST_SUCCESS',
        payload: { id: 'r2' },
      });
      const expected = [{ id: 'r1' }, { id: 'r2' }];
      expect(actual.created).to.deep.equal(expected);
    });

    it('removes edited reservation', () => {
      const state = immutable({
        created: [{ id: 'r1' }],
        edited: { id: 'r1' },
      });
      const actual = reducer(state, {
        type: 'RESERVATION_POST_SUCCESS',
        payload: { id: 'r2' },
      });
      expect(actual.edited).to.be.null;
    });
  });

  describe('RESERVATION_POST_ERROR', () => {
    function getAction(response) {
      return {
        type: 'RESERVATION_POST_ERROR',
        payload: {
          response,
        },
        meta: {
          reservation: { begin: '2017-01-02T17:00' },
        },
      };
    }

    it('adds correct data to failed reservations when non-field error', () => {
      const state = immutable({
        failed: [{ begin: '2017-01-01T10:00', failReason: 'Some' }],
      });
      const response = {
        non_field_errors: ['Some error', 'Another error'],
      };
      const actual = reducer(state, getAction(response));
      const expected = [
        { begin: '2017-01-01T10:00', failReason: 'Some' },
        { begin: '2017-01-02T17:00', failReason: 'Some error. Another error' },
      ];
      expect(actual.failed).to.deep.equal(expected);
    });

    it('adds correct data to failed reservations when detail', () => {
      const state = immutable({
        failed: [{ begin: '2017-01-01T10:00', failReason: 'Some' }],
      });
      const response = {
        detail: 'Some error',
      };
      const actual = reducer(state, getAction(response));
      const expected = [
        { begin: '2017-01-01T10:00', failReason: 'Some' },
        { begin: '2017-01-02T17:00', failReason: 'Some error' },
      ];
      expect(actual.failed).to.deep.equal(expected);
    });

    it('adds correct data to failed reservations when no reason', () => {
      const state = immutable({
        failed: [{ begin: '2017-01-01T10:00', failReason: 'Some' }],
      });
      const response = {};
      const actual = reducer(state, getAction(response));
      const expected = [
        { begin: '2017-01-01T10:00', failReason: 'Some' },
        { begin: '2017-01-02T17:00', failReason: 'Jotain meni vikaan' },
      ];
      expect(actual.failed).to.deep.equal(expected);
    });
  });

  describe('RESERVATION_PUT_SUCCESS', () => {
    it('sets payload to edited reservation', () => {
      const state = immutable({
        created: [{ id: 'r1' }],
      });
      const actual = reducer(state, {
        type: 'RESERVATION_PUT_SUCCESS',
        payload: { id: 'r2' },
      });
      expect(actual.edited).to.deep.equal({ id: 'r2' });
    });

    it('removes created reservations', () => {
      const state = immutable({
        created: [{ id: 'r1' }],
      });
      const actual = reducer(state, {
        type: 'RESERVATION_PUT_SUCCESS',
        payload: { id: 'r2' },
      });
      expect(actual.created).to.deep.equal([]);
    });
  });

  describe('HIDE_RESERVATION_SUCCESS_MODAL', () => {
    it('resets state', () => {
      const actual = reducer({ show: true }, {
        type: 'HIDE_RESERVATION_SUCCESS_MODAL',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });

  describe('SHOW_RESERVATION_SUCCESS_MODAL', () => {
    it('sets show to true', () => {
      const state = immutable({ created: [], show: false });
      const actual = reducer(state, {
        type: 'SHOW_RESERVATION_SUCCESS_MODAL',
      });
      const expected = {
        created: [],
        show: true,
      };
      expect(actual).to.deep.equal(expected);
    });
  });
});
