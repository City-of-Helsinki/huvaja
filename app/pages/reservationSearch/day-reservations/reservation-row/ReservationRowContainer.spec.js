import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import {
  UnconnectedReservationRowContainer as ReservationRowContainer,
} from './ReservationRowContainer';
import ReservationRow from './ReservationRow';

describe('pages/reservationSearch/day-reservations/reservation-row/ReservationRowContainer', () => {
  const defaults = {
    place: 'Room 1',
    eventSubject: 'Meeting',
    hostName: 'Michael Jackson',
    id: 123,
    numberOfParticipants: 15,
    onClick: () => null,
    timeRange: '18:00 - 19:30',
  };

  function getWrapper(props) {
    return shallow(<ReservationRowContainer {...defaults} {...props} />);
  }

  it('renders ReservationRow with correct props', () => {
    const row = getWrapper();
    expect(row.is(ReservationRow)).to.be.true;
    expect(row.prop('eventSubject')).to.equal(defaults.eventSubject);
    expect(row.prop('hostName')).to.equal(defaults.hostName);
    expect(row.prop('numberOfParticipants')).to.equal(defaults.numberOfParticipants);
    expect(row.prop('onClick')).to.be.a('function');
    expect(row.prop('place')).to.equal(defaults.place);
    expect(row.prop('timeRange')).to.equal(defaults.timeRange);
  });
});
