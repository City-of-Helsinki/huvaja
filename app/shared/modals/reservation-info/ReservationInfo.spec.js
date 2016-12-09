import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import ReservationInfo from './ReservationInfo';

describe('shared/modal/ReservationInfo', () => {
  const resource = {
    name: { fi: 'Huone' },
  };
  const unit = {
    name: { fi: 'Rakennus' },
  };
  const reservation = {
    id: 11,
    eventName: 'Reserved room',
    numberOfParticipants: 12,
    reserverName: 'Mr reserver',
    begin: '2016-01-01T08:00:00',
    end: '2016-01-01T10:00:00',
  };

  const defaults = {
    onHide: () => {},
    reservation,
    resource,
    unit,
    show: true,
  };

  function getWrapper(props) {
    return shallow(<ReservationInfo {...defaults} {...props} />);
  }

  it('renders a modal', () => {
    expect(getWrapper().is(Modal)).to.be.true;
  });

  it('passes show prop to Modal', () => {
    expect(getWrapper({ show: true }).prop('show')).to.be.true;
    expect(getWrapper({ show: false }).prop('show')).to.be.false;
  });

  it('passes onHide prop to Modal', () => {
    expect(getWrapper().prop('onHide')).to.equal(defaults.onHide);
  });

  describe('Modal header', () => {
    function getHeaderWrapper(props) {
      return getWrapper(props).find(Modal.Header);
    }

    it('renders unit name', () => {
      const unitName = getHeaderWrapper().find('.unit-name');
      expect(unitName.is('h2')).to.be.true;
      expect(unitName.text()).to.equal(unit.name.fi);
    });

    it('renders resource name', () => {
      const resourceName = getHeaderWrapper().find('.resource-name');
      expect(resourceName.is('h1')).to.be.true;
      expect(resourceName.text()).to.equal(resource.name.fi);
    });

    it('renders date', () => {
      const date = getHeaderWrapper().find('.reservation-time').find('.date');
      expect(date.text()).to.equal('pe 1.1.2016');
    });

    it('renders time', () => {
      const time = getHeaderWrapper().find('.reservation-time').find('.time');
      expect(time.text()).to.equal('08:00 - 10:00');
    });
  });

  describe('Modal body', () => {
    function getBodyWrapper(props) {
      return getWrapper(props).find(Modal.Body);
    }

    it('renders reservation participants number', () => {
      const reservationParticipants = getBodyWrapper().find('.reservation-participants-number');
      expect(reservationParticipants.html()).to.contain('Osallistujamäärä: ');
      expect(reservationParticipants.html()).to.contain(`${reservation.numberOfParticipants}`);
    });

    it('renders reservation reserver', () => {
      const reservationReserver = getBodyWrapper().find('.reservation-reserver');
      expect(reservationReserver.html()).to.contain('Varaaja: ');
      expect(reservationReserver.html()).to.contain(`${reservation.reserverName}`);
    });

    it('renders reservation reserver', () => {
      const reservationHost = getBodyWrapper().find('.reservation-host');
      expect(reservationHost.html()).to.contain('Tilaisuuden isäntä:');
      expect(reservationHost.html()).to.contain('Ivana Isäntä');
    });
  });
});
