import { expect } from 'chai';

import utils from './utils';

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
