import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationSuccessModal from './ReservationSuccessModal';
import { UnconnectedReservationSuccessModalContainer } from './ReservationSuccessModalContainer';

describe('modals/reservation-success/ReservationSuccessModalContainer', () => {
  const defaults = {
    createdReservations: [],
    editedReservation: null,
    failedReservations: [],
    onHide: () => null,
    resourceNames: {},
    show: true,
  };

  function getWrapper() {
    return shallow(<UnconnectedReservationSuccessModalContainer {...defaults} />);
  }

  it('renders modal with correct props', () => {
    const modal = getWrapper();
    expect(modal.is(ReservationSuccessModal)).to.be.true;
    expect(modal.props()).to.deep.equal(defaults);
  });
});
