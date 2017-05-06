import { expect } from 'chai';

import reducer from './reservationInfoModalReducer';

describe('state/reducers/reservationInfoModalReducer', () => {
  const initialState = {
    reservationId: null,
    show: false,
  };
  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('SHOW_RESERVATION_INFO_MODAL', () => {
    it('sets show to true', () => {
      const actual = reducer({ show: false }, {
        type: 'SHOW_RESERVATION_INFO_MODAL',
        payload: 23,
      });
      expect(actual.show).to.be.true;
    });
    it('sets payload as reservationId', () => {
      const actual = reducer({ reservationId: null }, {
        type: 'SHOW_RESERVATION_INFO_MODAL',
        payload: 23,
      });
      expect(actual.reservationId).to.equal(23);
    });
  });

  describe('HIDE_RESERVATION_INFO_MODAL', () => {
    it('resets state', () => {
      const actual = reducer({ show: true, reservationId: 23 }, {
        type: 'HIDE_RESERVATION_INFO_MODAL',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });

  describe('RESERVATION_DELETE_SUCCESS', () => {
    it('resets state', () => {
      const actual = reducer({ show: true, reservationId: 23 }, {
        type: 'RESERVATION_DELETE_SUCCESS',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });

  describe('ENTER_OR_CHANGE_RESERVATION_EDIT_PAGE', () => {
    it('resets state', () => {
      const actual = reducer({ show: true, reservationId: 23 }, {
        type: 'ENTER_OR_CHANGE_RESERVATION_EDIT_PAGE',
      });
      expect(actual).to.deep.equal(initialState);
    });
  });
});
