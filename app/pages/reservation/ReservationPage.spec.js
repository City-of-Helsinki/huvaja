import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationForm from 'shared/reservation-form';
import ReservationPage from './ReservationPage';

describe('pages/resource/EditReseservationPage', () => {
  const defaults = {
    params: {
      id: '123',
    },
  };

  function getWrapper(props) {
    return shallow(<ReservationPage {...defaults} {...props} />);
  }

  it('renders an edit ReservationForm', () => {
    const reservationForm = getWrapper().find(ReservationForm.edit);
    expect(reservationForm).to.have.length(1);
    expect(reservationForm.prop('reservationId')).to.equal(defaults.params.id);
  });
});
