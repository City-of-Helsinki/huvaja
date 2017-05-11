import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import Comments from 'shared/comments';
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
    eventSubject: 'Awesome meeting',
    hostName: 'Mr host',
    numberOfParticipants: 12,
    reserverName: 'Mr reserver',
    begin: '2016-01-01T08:00:00',
    end: '2016-01-01T10:00:00',
    userPermissions: { canDelete: false, canEdit: false },
  };

  const defaults = {
    onHide: () => {},
    reservation,
    resource,
    unit,
    show: true,
    showReservationCancelModal: () => null,
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

  it('renders event description', () => {
    const eventDescription = 'Some text describing the event.';
    const wrapper = getWrapper({
      reservation: {
        ...reservation,
        eventDescription,
      },
    });
    const text = wrapper.find('.details-text');
    expect(text.prop('text')).to.equal(eventDescription);
  });

  describe('Modal header', () => {
    function getHeaderWrapper(props) {
      return getWrapper(props).find(Modal.Header);
    }

    it('renders unit name', () => {
      const unitName = getHeaderWrapper().find('.unit-name');
      expect(unitName.text()).to.equal(unit.name.fi);
    });

    it('renders resource name', () => {
      const resourceName = getHeaderWrapper().find('.resource-name');
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

    it('renders event subject', () => {
      const eventSubject = getBodyWrapper().find('.event-subject');
      expect(eventSubject.text()).to.equal(reservation.eventSubject);
    });

    it('renders number of participants', () => {
      const reservationParticipants = getBodyWrapper().find('.reservation-participants-number');
      expect(reservationParticipants.html()).to.contain('Osallistujamäärä: ');
      expect(reservationParticipants.html()).to.contain(reservation.numberOfParticipants);
    });

    it('renders reservation reserver', () => {
      const reservationReserver = getBodyWrapper().find('.reservation-reserver');
      expect(reservationReserver.html()).to.contain('Varaaja: ');
      expect(reservationReserver.html()).to.contain(reservation.reserverName);
    });

    it('renders reservation host', () => {
      const reservationHost = getBodyWrapper().find('.reservation-host');
      expect(reservationHost.html()).to.contain('Tilaisuuden isäntä:');
      expect(reservationHost.html()).to.contain(reservation.hostName);
    });

    it('renders reservation comments', () => {
      const comments = getBodyWrapper().find('.reservation-comments');
      expect(comments).to.have.length(1);
      expect(comments.is(Comments)).to.be.true;
      expect(comments.prop('name')).to.equal('Varauksen viestit');
      expect(comments.prop('reservationId')).to.equal(reservation.id);
    });

    it('renders catering comments', () => {
      const comments = getBodyWrapper().find('.catering-comments');
      expect(comments).to.have.length(1);
      expect(comments.is(Comments)).to.be.true;
      expect(comments.prop('name')).to.equal('Tarjoilun viestit');
      expect(comments.prop('cateringId')).to.equal(reservation.id);
    });
  });

  describe('Modal footer', () => {
    function getFooterWrapper(props) {
      return getWrapper(props).find(Modal.Footer);
    }

    it('is not rendered when cannot delete nor modify', () => {
      const props = {
        reservation: {
          ...reservation,
          userPermissions: { canModify: false, canDelete: false },
        },
      };
      const footer = getFooterWrapper(props);
      expect(footer).to.have.length(0);
    });

    describe('cancel reservation button', () => {
      describe('when not userPermissions.canDelete', () => {
        function getButtonWrapper(props) {
          return getFooterWrapper(props).find('.reservation-cancel');
        }

        it('is not rendered', () => {
          expect(getButtonWrapper()).to.have.length(0);
        });
      });

      describe('when userPermissions.canDelete', () => {
        function getButtonWrapper(props) {
          const deletableReservation = {
            ...reservation,
            userPermissions: { canModify: false, canDelete: true },
          };
          return (
            getFooterWrapper({ reservation: deletableReservation, ...props })
            .find('.reservation-cancel')
          );
        }

        it('is rendered', () => {
          expect(getButtonWrapper()).to.have.length(1);
        });

        it('opens modal on click', () => {
          const showReservationCancelModal = simple.mock();
          const wrapper = getButtonWrapper({ showReservationCancelModal });
          wrapper.simulate('click');
          expect(showReservationCancelModal.callCount).to.equal(1);
          expect(showReservationCancelModal.lastCall.arg).to.equal(reservation.id);
        });
      });
    });

    describe('edit reservation link', () => {
      describe('when not userPermissions.canModify', () => {
        function getLinkWrapper(props) {
          return getFooterWrapper(props).find('.reservation-edit');
        }

        it('is not rendered', () => {
          expect(getLinkWrapper()).to.have.length(0);
        });
      });

      describe('when userPermissions.canModify', () => {
        function getLinkWrapper(props) {
          const editableReservation = {
            ...reservation,
            userPermissions: { canModify: true, canDelete: false },
          };
          return (
            getFooterWrapper({ reservation: editableReservation, ...props })
            .find('.reservation-edit')
          );
        }

        it('is rendered', () => {
          expect(getLinkWrapper()).to.have.length(1);
        });

        it('has link to edit page', () => {
          const link = getLinkWrapper();
          expect(link.prop('to')).to.equal(
            `/reservations/${reservation.id}/edit`
          );
        });
      });
    });
  });
});
