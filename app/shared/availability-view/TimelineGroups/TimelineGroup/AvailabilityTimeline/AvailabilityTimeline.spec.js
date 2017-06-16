import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import simple from 'simple-mock';

import AvailabilityTimeline from './AvailabilityTimeline';
import Reservation from './Reservation';
import ReservationSlot from './ReservationSlot';

function getWrapper(props) {
  const defaults = {
    canMakeReservations: true,
    id: 'resource-1',
    items: [],
    onReservationClick: () => null,
  };
  return shallow(<AvailabilityTimeline {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityTimeline', () => {
  it('renders a div.availability-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-timeline')).to.be.true;
  });

  it('does not add can-make-reservations class if not canMakeReservations', () => {
    const wrapperWithoutClass = (
      getWrapper({
        canMakeReservations: false,
      }).filter('.availability-timeline-can-make-reservations')
    );
    expect(wrapperWithoutClass).to.have.length(0);
  });

  it('adds can-make-reservations class if canMakeReservations', () => {
    const wrapperWithClass = (
      getWrapper().filter('.availability-timeline-can-make-reservations')
    );
    expect(wrapperWithClass).to.have.length(1);
  });

  it('renders given reservation slot', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation-slot',
        data: {
          begin: moment(),
          end: moment(),
          resourceId: '',
          isSelectable: true,
          userPermissions: {
            canModify: true,
          },
        },
      }],
    });
    const slot = wrapper.find(ReservationSlot);
    expect(slot).to.have.length(1);
  });

  it('renders given reservation', () => {
    const wrapper = getWrapper({
      items: [{
        key: '1',
        type: 'reservation',
        data: {
          begin: '',
          end: '',
          id: 12345,
          name: 'My Reservation',
          userPermissions: {
            canModify: true,
          },
        },
      }],
    });
    const reservation = wrapper.find(Reservation);
    expect(reservation).to.have.length(1);
    expect(reservation.prop('name')).to.equal('My Reservation');
  });

  it('renders slots and reservations', () => {
    const wrapper = getWrapper({
      items: [
        {
          key: '1',
          type: 'reservation-slot',
          data: {
            begin: moment(),
            end: moment(),
            resourceId: '',
            isSelectable: true,
            userPermissions: {
              canModify: true,
            },
          },
        },
        {
          key: '2',
          type: 'reservation',
          data: {
            begin: '',
            end: '',
            id: 12345,
            name: '',
            userPermissions: {
              canModify: true,
            },
          },
        },
        {
          key: '3',
          type: 'reservation-slot',
          data: {
            begin: moment(),
            end: moment(),
            resourceId: '',
            isSelectable: false,
            userPermissions: {
              canModify: true,
            },
          },
        },
      ],
    });
    const children = wrapper.children();
    expect(children.at(0).is(ReservationSlot)).to.be.true;
    expect(children.at(1).is(Reservation)).to.be.true;
    expect(children.at(2).is(ReservationSlot)).to.be.true;
  });

  describe('handleMouseEnter', () => {
    it('is passed to container', () => {
      const wrapper = getWrapper();
      expect(wrapper.prop('onMouseEnter')).to.equal(wrapper.instance().handleMouseEnter);
    });

    it('works if no onMouseEnter prop', () => {
      const wrapper = getWrapper({ onMouseEnter: null });
      wrapper.instance().handleMouseEnter();
    });

    it('calls onMouseEnter prop', () => {
      const id = 'some-resource-id';
      const onMouseEnter = simple.mock();
      const wrapper = getWrapper({ id, onMouseEnter });
      wrapper.instance().handleMouseEnter();
      expect(onMouseEnter.callCount).to.equal(1);
      expect(onMouseEnter.lastCall.args).to.deep.equal([id]);
    });
  });

  describe('handleMouseLeave', () => {
    it('is passed to container', () => {
      const wrapper = getWrapper();
      expect(wrapper.prop('onMouseLeave')).to.equal(wrapper.instance().handleMouseLeave);
    });

    it('works if no onMouseLeave prop', () => {
      const wrapper = getWrapper({ onMouseLeave: null });
      wrapper.instance().handleMouseLeave();
    });

    it('calls onMouseLeave prop', () => {
      const id = 'some-resource-id';
      const onMouseLeave = simple.mock();
      const wrapper = getWrapper({ id, onMouseLeave });
      wrapper.instance().handleMouseLeave();
      expect(onMouseLeave.callCount).to.equal(1);
      expect(onMouseLeave.lastCall.args).to.deep.equal([id]);
    });
  });
});
