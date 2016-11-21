import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationSlot from './ReservationSlot';
import utils from './utils';

function getWrapper() {
  return shallow(<ReservationSlot />);
}

describe('shared/resource-availability/ReservationSlot', () => {
  it('returns a div.reservation-slot', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.reservation-slot')).to.be.true;
  });

  it('has correct width', () => {
    const expected = utils.getTimeSlotWidth();
    const actual = getWrapper().prop('style');
    expect(actual).to.deep.equal({ width: expected });
  });
});
