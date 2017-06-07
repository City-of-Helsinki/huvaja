import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './reservationInfoSelector';

describe('shared/modals/reservation-info/reservationInfoSelector', () => {
  const cateringProvider = {
    id: 77,
    units: ['ijkl'],
  };
  const cateringOrder = {
    id: 123,
    orderLines: [{
      product: 33,
      quantity: 10,
    }],
  };
  const defaultState = {
    'modals.reservationInfo': { reservationId: 'abcd' },
    'data.reservations': { abcd: { id: 'abcd', resource: 'efgh' } },
    'data.resources': { efgh: { unit: 'ijkl' } },
    'data.units': { ijkl: { spam: 'ham' } },
    reservationCateringOrders: {
      abcd: 123,
    },
    'data.cateringOrders': {
      123: cateringOrder,
    },
    'data.cateringProducts': {
      33: {
        name: 'Coffee',
      },
    },
    'data.cateringProviders': {
      77: cateringProvider,
    },
  };

  it('returns reservationId from the state', () => {
    const state = getState({
      'modals.reservationInfo': { reservationId: 'abcd' },
    });
    const actual = selector(state).reservationId;
    expect(actual).to.equal(state.modals.reservationInfo.reservationId);
  });

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

  describe('cateringOrder', () => {
    it('returns cateringOrder', () => {
      const state = getState(defaultState);
      const actual = selector(state).cateringOrder;
      expect(actual).to.deep.equal(cateringOrder);
    });
  });

  describe('cateringOrderItems', () => {
    it('returns cateringOrderItems', () => {
      const state = getState(defaultState);
      const actual = selector(state).cateringOrderItems;
      const expected = [{
        name: 'Coffee',
        quantity: 10,
      }]
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('cateringProvider', () => {
    it('returns cateringProvider', () => {
      const state = getState(defaultState);
      const actual = selector(state).cateringProvider;
      expect(actual).to.deep.equal(cateringProvider);
    });
  });

  describe('shouldFetchCateringData', () => {
    it('returns true if products not fetched and is not fetching catering data', () => {
      const extraState = {
        ...defaultState,
        'data.cateringProducts': {},
      }
      const state = getState(extraState);
      const actual = selector(state).shouldFetchCateringData;
      expect(actual).to.be.true;
    });

    it('returns false if products fetched', () => {
      const state = getState(defaultState);
      const actual = selector(state).shouldFetchCateringData;
      expect(actual).to.be.false;
    });

    it('returns false if currently fetching catering data', () => {
      const extraState = {
        ...defaultState,
        activeRequests: {
          CATERING_PRODUCTS_GET: 1,
        },
      };
      const state = getState(extraState);
      const actual = selector(state).shouldFetchCateringData;
      expect(actual).to.be.false;
    });
  });
});
