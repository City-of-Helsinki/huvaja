import { expect } from 'chai';

import reducer from './reservationCateringOrdersReducer';

describe('state/reducers/reservationCateringOrdersReducer', () => {
  const initialState = {};

  it('returns correct initial state', () => {
    const actual = reducer(undefined, { type: 'NOOP' });
    expect(actual).to.deep.equal(initialState);
  });

  describe('CATERING_ORDER_GET_SUCCESS', () => {
    it('returns old state if no orders in state', () => {
      const state = { 1: 2 };
      const actual = reducer(state, {
        type: 'CATERING_ORDER_GET_SUCCESS',
        payload: {
          entities: {},
        },
      });
      expect(actual).to.deep.equal(state);
    });

    it('adds new mappings to state', () => {
      const state = { 1: 2 };
      const actual = reducer(state, {
        type: 'CATERING_ORDER_GET_SUCCESS',
        payload: {
          entities: {
            cateringOrders: {
              6: {
                id: 6,
                reservation: 5,
              },
            },
          },
        },
      });
      const expected = {
        1: 2,
        5: 6,
      };
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('CATERING_ORDER_POST_SUCCESS', () => {
    it('adds new mapping to state', () => {
      const state = { 1: 2 };
      const actual = reducer(state, {
        type: 'CATERING_ORDER_POST_SUCCESS',
        payload: {
          id: 6,
          reservation: 5,
        },
      });
      const expected = {
        1: 2,
        5: 6,
      };
      expect(actual).to.deep.equal(expected);
    });
  });
});
