import { expect } from 'chai';

import { getState } from 'utils/testUtils';
import selector from './cateringFormSelector';

describe('pages/resource/reservation-form/catering/catering-form/cateringFormSelector', () => {
  function getSelected(extraState = {}) {
    const defaults = {
      'form.resourceReservation.values': {},
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
      1: { id: 1, name: 'Coffee' },
      2: { id: 2, name: 'Coca Cola' },
    };
    const selected = getSelected({ 'data.cateringMenuItems': cateringMenuItems });
    expect(selected.cateringMenuItems[1]).to.deep.equal(cateringMenuItems[1]);
    expect(selected.cateringMenuItems[2]).to.deep.equal(cateringMenuItems[2]);
  });

  describe('defaultCateringTime', () => {
    it('returns reservation begin time if it is set', () => {
      const time = {
        begin: '2016-12-12T10:00:00',
        end: '2016-12-12T11:00:00',
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
      const selected = getSelected({ 'form.resourceReservation.values': { numberOfParticipants } });
      expect(selected.defaultItemQuantity).to.equal(numberOfParticipants);
    });

    it('returns 1 if reservation numberOfParticipants is not set', () => {
      const selected = getSelected();
      expect(selected.defaultItemQuantity).to.equal(1);
    });
  });
});
