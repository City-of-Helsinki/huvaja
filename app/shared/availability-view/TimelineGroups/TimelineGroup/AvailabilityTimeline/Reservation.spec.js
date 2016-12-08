import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';

import Reservation from './Reservation';
import utils from '../utils';

function getOverlayTrigger(props) {
  const defaults = {
    begin: '2016-01-01T10:00:00Z',
    end: '2016-01-01T12:00:00Z',
    eventSubject: 'Meeting',
    id: 12345,
  };
  return shallow(<Reservation {...defaults} {...props} />);
}

function getWrapper(props) {
  return getOverlayTrigger(props).find('.reservation');
}

describe('shared/availability-view/Reservation', () => {
  it('renders a div.reservation', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.reservation')).to.be.true;
  });

  it('renders an OverlayTrigger', () => {
    const wrapper = getOverlayTrigger();
    expect(wrapper.is(OverlayTrigger)).to.be.true;
  });

  it('renders a popover', () => {
    const overlayTrigger = getOverlayTrigger();
    const overlay = overlayTrigger.prop('overlay');
    expect(overlay.type).to.equal(Popover);
  });

  it('has correct width', () => {
    const times = {
      end: '2016-01-01T20:00:00Z',
      begin: '2016-01-01T10:00:00Z',
    };
    const expected = utils.getTimeSlotWidth({
      startTime: moment(times.begin),
      endTime: moment(times.end),
    });
    const actual = getWrapper(times).prop('style');
    expect(actual).to.deep.equal({ width: expected });
  });

  it('renders start time', () => {
    const begin = '2016-01-01T10:30:00Z';
    const element = getWrapper({ begin }).find('.start-time');
    expect(element).to.have.length(1);
    expect(element.text()).to.equal(moment(begin).format('HH:mm'));
  });

  it('renders end time', () => {
    const end = '2016-01-01T10:30:00Z';
    const element = getWrapper({ end }).find('.end-time');
    expect(element).to.have.length(1);
    expect(element.text()).to.equal(moment(end).format('HH:mm'));
  });

  it('renders eventSubject', () => {
    const eventSubject = 'Meeting GUQ';
    const element = getWrapper({ eventSubject }).find('.event-subject');
    expect(element).to.have.length(1);
    expect(element.text()).to.equal(eventSubject);
  });

  it('renders reserverName', () => {
    const reserverName = 'Luke Skywalker';
    const element = getWrapper({ reserverName }).find('.reserver-name');
    expect(element).to.have.length(1);
    expect(element.text()).to.equal(reserverName);
  });
});
