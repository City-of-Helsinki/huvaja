import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './cateringFormSelector';

describe('shared/reservation-form/catering/catering-form/cateringFormSelector', () => {
  const products = {
    1: { id: 1, name: 'Coffee', category: 4 },
    2: { id: 2, name: 'Coca Cola', category: 4 },
    3: { id: 3, name: 'Bread', category: 5 },
  };
  const categories = {
    4: { id: 4, name: { fi: 'drinks' }, products: [1, 2], provider: 'c1' },
    5: { id: 5, name: { fi: 'food' }, products: [3], provider: 'c1' },
    6: { id: 6, name: { fi: 'lunch' }, products: [], provider: 'x' },
  };
  const provider = {
    id: 'c1',
    units: ['u1'],
    priceListUrl: { fi: 'example' },
  };
  const numberOfParticipants = 12;
  const cateringFormValues = {
    invoicingData: '123',
    message: 'Hello!',
    order: {},
    servingTime: '14:00',
  };
  const reservationFormCateringOrder = {
    invoicingData: '54321',
    message: 'Hola!',
    order: { 3: 8 },
    servingTime: '12:30',
  };
  const beginTime = '15:00';
  const defaults = {
    'data.cateringProducts': products,
    'data.cateringProductCategories': categories,
    'form.catering.values': cateringFormValues,
    'form.resourceReservation.values': {
      cateringOrder: reservationFormCateringOrder,
      numberOfParticipants,
      resource: 'r1',
      time: {
        begin: {
          time: beginTime,
        },
        end: {},
      },
    },
    'data.resources': { r1: { id: 'r1', unit: 'u1' } },
    'data.units': { u1: { id: 'u1' } },
    'data.cateringProviders': {
      c1: provider,
    },
  };

  function getSelected(extraState = {}) {
    const state = getState({ ...defaults, ...extraState });
    return selector(state);
  }

  it('returns cateringMenuItems from state', () => {
    const selected = getSelected();
    expect(selected.cateringMenuItems[1]).to.deep.equal(products[1]);
    expect(selected.cateringMenuItems[2]).to.deep.equal(products[2]);
  });

  it('returns cateringProvider from state', () => {
    const selected = getSelected();
    expect(selected.cateringProvider).to.deep.equal(provider);
  });

  describe('defaultItemQuantity', () => {
    it('returns reservation numberOfParticipants if it is set', () => {
      const selected = getSelected();
      expect(selected.defaultItemQuantity).to.equal(numberOfParticipants);
    });

    it('returns 1 if reservation numberOfParticipants is not set', () => {
      const extraState = {
        'form.resourceReservation.values': {
          resource: 'r1',
          time: {
            begin: {},
            end: {},
          },
        },
      };
      const selected = getSelected(extraState);
      expect(selected.defaultItemQuantity).to.equal(1);
    });
  });

  describe('cateringMenu', () => {
    it('returns categories sorted by name', () => {
      const selected = getSelected();
      const expected = [
        { ...categories[4], products: [products[1], products[2]] },
        { ...categories[5], products: [products[3]] },
      ];
      expect(selected.cateringMenu).to.deep.equal(expected);
    });
  });

  describe('formValues', () => {
    it('returns catering form values', () => {
      const selected = getSelected();
      expect(selected.formValues).to.deep.equal(cateringFormValues);
    });
  });

  describe('initialValues', () => {
    it('returns values from reservation form', () => {
      const selected = getSelected();
      expect(selected.initialValues).to.deep.equal(reservationFormCateringOrder);
    });

    it('returns correct values when empty data', () => {
      const selected = getSelected({
        'form.resourceReservation.values': {
          cateringOrder: {},
          numberOfParticipants,
          resource: 'r1',
          time: {
            begin: {},
            end: {},
          },
        },
      });
      const expected = {
        invoicingData: '',
        message: '',
        order: {},
        servingTime: '',
      };
      expect(selected.initialValues).to.deep.equal(expected);
    });
  });
});
