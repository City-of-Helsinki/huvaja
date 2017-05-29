import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './cateringFormSelector';

describe('shared/reservation-form/catering/catering-form/cateringFormSelector', () => {
  function getSelected(extraState = {}) {
    const defaults = {
      'form.resourceReservation.values': {
        time: {
          begin: {},
          end: {},
        },
      },
    };
    const state = getState({ ...defaults, ...extraState });
    return selector(state);
  }

  it('returns cateringData from state', () => {
    const cateringData = {
      additionalInfo: 'Some info',
      order: { 1: 5, 2: 7 },
      projectNumber: 'abc123',
      time: '10:45',
    };
    const selected = getSelected({ catering: cateringData });
    expect(selected.cateringData).to.deep.equal(cateringData);
  });

  it('returns cateringMenuItems from state', () => {
    const cateringMenuItems = {
      products: {
        1: { id: 1, name: 'Coffee' },
        2: { id: 2, name: 'Coca Cola' },
      },
    };
    const selected = getSelected({ 'data.cateringMenuItems': cateringMenuItems });
    expect(selected.cateringMenuItems[1]).to.deep.equal(cateringMenuItems.products[1]);
    expect(selected.cateringMenuItems[2]).to.deep.equal(cateringMenuItems.products[2]);
  });

  it('returns cateringProvider from state', () => {
    const state = {
      'form.resourceReservation.values': {
        resource: 'r1',
        time: { begin: {}, end: {} },
      },
      'data.resources': { r1: { id: 'r1', unit: 'u1' } },
      'data.units': { u1: { id: 'u1' } },
      'data.cateringProviders': { c1: { id: 'c1', units: ['u1'], priceListUrl: 'example' } },
    };
    const selected = getSelected(state);
    expect(selected.cateringProvider).to.deep.equal(state['data.cateringProviders'].c1);
  });

  describe('defaultCateringTime', () => {
    it('returns reservation begin time if it is set', () => {
      const time = {
        begin: { date: '2016-12-12', time: '10:00' },
        end: { date: '2016-12-12', time: '11:00' },
      };
      const selected = getSelected({ 'form.resourceReservation.values': { time } });
      expect(selected.defaultCateringTime).to.equal('10:00');
    });

    it('returns "12:00" if reservation begin time is not set', () => {
      const selected = getSelected();
      expect(selected.defaultCateringTime).to.equal('12:00');
    });
  });

  describe('defaultItemQuantity', () => {
    it('returns reservation numberOfParticipants if it is set', () => {
      const numberOfParticipants = 12;
      const selected = getSelected({
        'form.resourceReservation.values': {
          numberOfParticipants,
          time: { begin: {}, end: {} },
        },
      });
      expect(selected.defaultItemQuantity).to.equal(numberOfParticipants);
    });

    it('returns 1 if reservation numberOfParticipants is not set', () => {
      const selected = getSelected();
      expect(selected.defaultItemQuantity).to.equal(1);
    });
  });
});
