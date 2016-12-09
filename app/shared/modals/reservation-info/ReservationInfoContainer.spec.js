import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import ReservationInfo from './ReservationInfo';
import { UnconnectedReservationInfoContainer as ReservationInfoContainer } from './ReservationInfoContainer';

describe('shared/modals/reservation-info/ReservationInfoContainer', () => {
  const defaults = {
    fetchReservation: () => null,
    isLoaded: true,
    location: { query: {} },
    onHide: () => null,
    reservation: {},
    reservationId: 1,
    resource: {},
    show: true,
    unit: {},
  };
  function getWrapper(props) {
    return shallow(<ReservationInfoContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a ReservationInfo', () => {
      const reservationInfo = getWrapper().find(ReservationInfo);
      expect(reservationInfo).to.have.length(1);
      expect(reservationInfo.prop('onHide')).to.equal(defaults.onHide);
      expect(reservationInfo.prop('reservation')).to.equal(defaults.reservation);
      expect(reservationInfo.prop('resource')).to.equal(defaults.resource);
      expect(reservationInfo.prop('show')).to.equal(defaults.show);
      expect(reservationInfo.prop('unit')).to.equal(defaults.unit);
    });
  });

  describe('componentWillReceiveProps', () => {
    it('fetches reservation if nextProps with reservationId and without reservation', () => {
      const fetchReservation = simple.mock();
      const instance = getWrapper({ fetchReservation }).instance();
      instance.componentWillReceiveProps({
        reservation: null,
        reservationId: 12,
      });
      expect(fetchReservation.callCount).to.equal(1);
      expect(fetchReservation.lastCall.args).to.deep.equal([12]);
    });

    it('does not fetch reservation if nextProps with reservation', () => {
      const fetchReservation = simple.mock();
      const instance = getWrapper({ fetchReservation }).instance();
      instance.componentWillReceiveProps({
        reservation: {},
        reservationId: 12,
      });
      expect(fetchReservation.callCount).to.equal(0);
    });
  });
});
