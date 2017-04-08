import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './ReservationCancelSelector';

describe('shared/modals/reservation-cancel/ReservationCancelSelector', () => {
  describe('reservation', () => {
    it('returns reservation', () => {
      const state = getState({
        'data.reservations': { abcd: { spam: 'ham' } },
        'modals.reservationCancel': { reservationId: 'abcd' },
      });
      const actual = selector(state).reservation;
      expect(actual).to.equal(state.data.reservations.abcd);
    });

    it('returns undefined if id not found', () => {
      const state = getState({
        'modals.reservationCancel': { reservationId: 'abcd' },
      });
      const actual = selector(state).reservation;
      expect(actual).to.be.undefined;
    });
  });

  describe('show', () => {
    it('returns true if reservationCancel modal show is true', () => {
      const state = getState({
        'modals.reservationCancel': { show: true },
      });
      const actual = selector(state).show;
      expect(actual).to.be.true;
    });

    it('returns false if reservationCancel modal show is false', () => {
      const state = getState({
        'modals.reservationCancel': { show: false },
      });
      const actual = selector(state).show;
      expect(actual).to.be.false;
    });
  });

  describe('isCancelling', () => {
    it('returns true if cancel request is active', () => {
      const state = getState({
        activeRequests: { RESERVATION_DELETE: 1 },
      });
      const actual = selector(state).isCancelling;
      expect(actual).to.be.true;
    });

    it('returns false if cancel request is not active', () => {
      const state = getState({
        activeRequests: { RESERVATION_DELETE: 0 },
      });
      const actual = selector(state).isCancelling;
      expect(actual).to.be.false;
    });
  });
});
