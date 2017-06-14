import { expect } from 'chai';

import cateringUtils from 'utils/cateringUtils';
import { getState } from 'utils/testUtils';
import reservationEditPageSelector from './ReservationEditPageSelector';

describe('pages/search/ReservationEditPageSelector', () => {
  const resources = {
    'r-2': { id: 'r-2' },
    'r-3': { id: 'r-3' },
  };
  const reservations = {
    1: { id: 1, resource: 'r-1' },
    2: { id: 2, resource: 'r-2' },
  };
  const cateringOrders = {
    5: {
      id: 5,
      invoincingData: 'abc123',
      orderLines: [
        { product: 3, quantity: 10 },
      ],
    },
  }

  function getSelected(id = '2') {
    const state = getState({
      'data.cateringOrders': cateringOrders,
      'data.reservations': reservations,
      'data.resources': resources,
      'reservationCateringOrders': { 2: 5 },
    });
    const props = {
      params: { id },
    };
    return reservationEditPageSelector(state, props);
  }

  it('returns reservation', () => {
    expect(getSelected().reservation).to.deep.equal(reservations[2]);
  });

  it('returns resource', () => {
    expect(getSelected().resource).to.deep.equal(resources['r-2']);
  });

  it('returns isFetching', () => {
    expect(getSelected().isFetching).to.be.false;
  });

  describe('cateringOrder', () => {
    it('returns correct catering order form value', () => {
      const expected = cateringUtils.cateringOrderToFormValue(cateringOrders[5]);
      expect(getSelected().cateringOrder).to.deep.equal(expected);
    });

    it('returns undefined if reservation does not have catering order', () => {
      expect(getSelected('1').cateringOrder).to.be.undefined;
    });
  });
});
