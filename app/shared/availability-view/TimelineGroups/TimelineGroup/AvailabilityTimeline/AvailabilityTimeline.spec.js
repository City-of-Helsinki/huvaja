import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';
import AvailabilityTimeline from './AvailabilityTimeline';

function getWrapper(props) {
  const defaults = { items: [] };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  it('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).to.be.true;
  });

  it('renders given reservation slot', () => {
    const wrapper = getWrapper({ items: [{ key: '1', type: 'reservation-slot' }] });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).to.have.length(1);
  });

  it('renders given reservation', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation',
        data: {
          begin: '',
          end: '',
          name: 'My Reservation',
        },
      }],
    });
    const reservation = wrapper.find(Reservation);
    expect(reservation).to.have.length(1);
    expect(reservation.prop('name')).to.equal('My Reservation');
  });

  it('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        { key: '1', type: 'reservation-slot' },
        { key: '2', type: 'reservation', data: { begin: '', end: '', name: '' } },
        { key: '3', type: 'reservation-slot' },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).to.be.true;
    expect(children.at(1).is(Reservation)).to.be.true;
    expect(children.at(2).is(ReservationSlot)).to.be.true;
  });
});
