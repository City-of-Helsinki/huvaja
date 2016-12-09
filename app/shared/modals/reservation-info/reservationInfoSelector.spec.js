import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './reservationInfoSelector';

describe('shared/modals/reservation-info/reservationInfoSelector', () => {
  describe('reservation', () => {
    it('returns reservation', () => {
      const state = getState({
        'data.reservations': { abcd: { spam: 'ham' } },
        'modals.reservationInfo': { reservationId: 'abcd' },
      });
      const actual = selector(state).reservation;
      expect(actual).to.equal(state.data.reservations.abcd);
    });

    it('returns undefined if id not found', () => {
      const state = getState({
        'modals.reservationInfo': { reservationId: 'abcd' },
      });
      const actual = selector(state).reservation;
      expect(actual).to.be.undefined;
    });
  });


  describe('resource', () => {
    it('returns resource from reservation', () => {
      const state = getState({
        'modals.reservationInfo': { reservationId: 'abcd' },
        'data.reservations': { abcd: { resource: 'efgh' } },
        'data.resources': { efgh: { spam: 'ham' } },
      });
      const actual = selector(state).resource;
      expect(actual).to.equal(state.data.resources.efgh);
    });

    it('returns undefined if reservation is not found', () => {
      const state = getState({
        'modals.reservationInfo': { reservationId: 'abcd' },
      });
      const actual = selector(state).resource;
      expect(actual).to.be.undefined;
    });
  });

  describe('unit', () => {
    it('returns unit from resource', () => {
      const state = getState({
        'modals.reservationInfo': { reservationId: 'abcd' },
        'data.reservations': { abcd: { resource: 'efgh' } },
        'data.resources': { efgh: { unit: 'ijkl' } },
        'data.units': { ijkl: { spam: 'ham' } },
      });
      const actual = selector(state).unit;
      expect(actual).to.equal(state.data.units.ijkl);
    });

    it('returns undefined if resource is not found', () => {
      const state = getState({
        'modals.reservationInfo': { reservationId: 'abcd' },
      });
      const actual = selector(state).unit;
      expect(actual).to.be.undefined;
    });
  });

  describe('show', () => {
    it('returns true if reservationInfo modal show is true', () => {
      const state = getState({
        'modals.reservationInfo': { show: true },
      });
      const actual = selector(state).show;
      expect(actual).to.be.true;
    });

    it('returns false if reservationInfo modal show is false', () => {
      const state = getState({
        'modals.reservationInfo': { show: false },
      });
      const actual = selector(state).show;
      expect(actual).to.be.false;
    });
  });
});
