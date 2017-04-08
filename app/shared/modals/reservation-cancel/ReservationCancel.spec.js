import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import ReservationCancel from './ReservationCancel';

describe('shared/modals/reservation-cancel/ReservationCancel', () => {
  const reservation = {
    id: '123',
    name: { fi: 'Palaveri' },
  };
  const defaults = {
    cancelReservation: () => null,
    isCancelling: false,
    onHide: () => {},
    reservation,
    show: true,
  };

  function getWrapper(props) {
    return shallow(<ReservationCancel {...defaults} {...props} />);
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

  describe('confirm button', () => {
    function getButtonWrapper(props) {
      return getWrapper(props).find('.confirm-button');
    }

    it('renders correct text', () => {
      const button = getButtonWrapper();
      expect(button).to.have.length(1);
      expect(button.children().text()).to.equal('Poista varaus');
    });

    it('renders different text when cancelling in progress', () => {
      const button = getButtonWrapper({ isCancelling: true });
      expect(button).to.have.length(1);
      expect(button.children().text()).to.equal('Poistetaan...');
    });

    it('cancels reservation on click', () => {
      const cancelReservation = simple.mock();
      const button = getButtonWrapper({ cancelReservation });
      button.simulate('click');
      expect(cancelReservation.callCount).to.equal(1);
      expect(cancelReservation.lastCall.arg).to.deep.equal(reservation);
    });
  });
});
