import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ReservationCancel from './ReservationCancel';
import { UnconnectedReservationCancelContainer as ReservationCancelContainer } from './ReservationCancelContainer';

describe('shared/modals/reservation-cancel/ReservationCancelContainer', () => {
  const defaults = {
    cancelReservation: () => null,
    isCancelling: false,
    onHide: () => null,
    reservation: { id: '123' },
    show: true,
  };

  function getWrapper(props) {
    return shallow(<ReservationCancelContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a ReservationCancel', () => {
      const reservationCancel = getWrapper().find(ReservationCancel);
      expect(reservationCancel).to.have.length(1);
      expect(reservationCancel.prop('cancelReservation')).to.equal(defaults.cancelReservation);
      expect(reservationCancel.prop('isCancelling')).to.equal(defaults.isCancelling);
      expect(reservationCancel.prop('onHide')).to.equal(defaults.onHide);
      expect(reservationCancel.prop('reservation')).to.equal(defaults.reservation);
      expect(reservationCancel.prop('show')).to.equal(defaults.show);
    });

    it('renders empty div if no reservation', () => {
      const reservationCancel = getWrapper({ reservation: null });
      expect(reservationCancel.html()).to.equal('<div></div>');
    });
  });
});
