import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationRow from './ReservationRow';

describe('pages/reservationSearch/reservation-row/ReservationRow', () => {
  const defaults = {
    place: 'Room 1',
    eventSubject: 'Meeting',
    hostName: 'Michael Jackson',
    numberOfParticipants: 15,
    onClick: () => null,
    timeRange: '18:00 - 19:30',
  };

  function getWrapper(props) {
    return shallow(<ReservationRow {...defaults} {...props} />);
  }

  it('renders a.reservation-row with onClick', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('a.reservation-row')).to.be.true;
    expect(wrapper.prop('onClick')).to.equal(defaults.onClick);
  });

  it('renders time range', () => {
    const timeRange = getWrapper().find('.time-range');
    expect(timeRange.text()).to.equal(defaults.timeRange);
  });

  it('renders host name', () => {
    const hostName = getWrapper().find('.host-name');
    expect(hostName.text()).to.equal(defaults.hostName);
  });

  it('renders place', () => {
    const place = getWrapper().find('.place');
    expect(place.text()).to.equal(defaults.place);
  });

  it('renders number of participants', () => {
    const num = getWrapper().find('.number-of-participants');
    expect(num.text()).to.contain(defaults.numberOfParticipants);
  });

  it('renders event subject', () => {
    const eventSubject = getWrapper().find('.event-subject');
    expect(eventSubject.text()).to.equal(defaults.eventSubject);
  });
});
