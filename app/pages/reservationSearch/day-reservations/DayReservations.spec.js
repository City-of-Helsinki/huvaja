import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import ReservationRow from './reservation-row';
import DayReservations from './DayReservations';

function getWrapper(props) {
  const defaults = {
    day: moment('2016-01-03'),
    reservations: [1, 2],
  };
  return shallow(<DayReservations {...defaults} {...props} />);
}

describe('pages/reservationSearch/day-reservations/DayReservations', () => {
  it('renders a div.day-reservations', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.day-reservations')).to.be.true;
  });

  it('renders correctly formatted day', () => {
    const day = getWrapper().find('.day');
    expect(day.text()).to.equal('su 3.1.2016');
  });

  it('renders ReservationRows with correct ids', () => {
    const rows = getWrapper().find(ReservationRow);
    expect(rows).to.have.length(2);
    expect(rows.at(0).prop('id')).to.equal(1);
    expect(rows.at(1).prop('id')).to.equal(2);
  });
});
