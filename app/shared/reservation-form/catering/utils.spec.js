import { expect } from 'chai';

import utils from './utils';

describe('shared/reservation-form/catering/utils', () => {
  describe('getOrderItems', () => {
    it('combines cateringMenuItems and order data', () => {
      const cateringMenuItems = {
        1: { id: 1, name: 'Coffee', price: 1.5 },
        2: { id: 2, name: 'Latte', price: 2.5 },
      };
      const order = { 1: 5, 2: 7 };
      const orderItems = utils.getOrderItems(cateringMenuItems, order);
      const expected = [
        { id: 1, name: 'Coffee', price: 1.5, quantity: 5 },
        { id: 2, name: 'Latte', price: 2.5, quantity: 7 },
      ];
      expect(orderItems).to.deep.equal(expected);
    });

    it('does not return items that are not in the order', () => {
      const cateringMenuItems = {
        1: { id: 1, name: 'Coffee', price: 1.5 },
        2: { id: 2, name: 'Latte', price: 2.5 },
      };
      const order = { 1: 5 };
      const orderItems = utils.getOrderItems(cateringMenuItems, order);
      const expected = [
        { id: 1, name: 'Coffee', price: 1.5, quantity: 5 },
      ];
      expect(orderItems).to.deep.equal(expected);
    });

    it('does not return items whose quantity is 0', () => {
      const cateringMenuItems = {
        1: { id: 1, name: 'Coffee', price: 1.5 },
        2: { id: 2, name: 'Latte', price: 2.5 },
      };
      const order = { 1: 5, 2: 0 };
      const orderItems = utils.getOrderItems(cateringMenuItems, order);
      const expected = [
        { id: 1, name: 'Coffee', price: 1.5, quantity: 5 },
      ];
      expect(orderItems).to.deep.equal(expected);
    });

    it('returns items in alphabetical order', () => {
      const cateringMenuItems = {
        1: { id: 1, name: 'Coffee', price: 1.5 },
        2: { id: 2, name: 'Latte', price: 2.5 },
        3: { id: 3, name: 'Coca Cola', price: 3.0 },
      };
      const order = { 1: 5, 2: 7, 3: 9 };
      const orderItems = utils.getOrderItems(cateringMenuItems, order);
      const expected = [
        { id: 3, name: 'Coca Cola', price: 3.0, quantity: 9 },
        { id: 1, name: 'Coffee', price: 1.5, quantity: 5 },
        { id: 2, name: 'Latte', price: 2.5, quantity: 7 },
      ];
      expect(orderItems).to.deep.equal(expected);
    });
  });

  describe('hasOrders', () => {
    it('returns true if there are orders', () => {
      const cateringData = {
        order: {
          2: 10,
        },
      };
      const actual = utils.hasOrders(cateringData);
      expect(actual).to.be.true;
    });

    it('returns false if there no orders', () => {
      const cateringData = {
        order: {},
      };
      const actual = utils.hasOrders(cateringData);
      expect(actual).to.be.false;
    });

    it('returns false if there only orders with quantity = 0', () => {
      const cateringData = {
        order: {
          2: 0,
        },
      };
      const actual = utils.hasOrders(cateringData);
      expect(actual).to.be.false;
    });
  });
});
