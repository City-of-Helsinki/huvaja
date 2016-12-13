import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Popover from 'react-bootstrap/lib/Popover';
import simple from 'simple-mock';

import Reservation from './Reservation';
import Link from './Link';
import utils from '../utils';

function getOuterWrapper(props) {
  const defaults = {
    begin: '2016-01-01T10:00:00Z',
    end: '2016-01-01T12:00:00Z',
    eventSubject: 'Meeting',
    id: 12345,
    onClick: () => {},
  };
  return shallow(<Reservation {...defaults} {...props} />);
}

function getWrapper(props) {
  return getOuterWrapper(props).find('.reservation');
}

describe('shared/availability-view/Reservation', () => {
  it('renders a div.reservation', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.reservation')).to.be.true;
  });

  it('renders a link', () => {
    const wrapper = getOuterWrapper();
    expect(wrapper.is(Link)).to.be.true;
  });

  it('renders an OverlayTrigger', () => {
    const trigger = getOuterWrapper().find(OverlayTrigger);
    expect(trigger).to.have.length(1);
  });

  it('renders a popover', () => {
    const overlayTrigger = getOuterWrapper().find(OverlayTrigger);
    const overlay = overlayTrigger.prop('overlay');
    expect(overlay.type).to.equal(Popover);
  });

  it('on click it calls prop.onClick and passes id', () => {
    const onClick = simple.mock();
    const wrapper = getOuterWrapper({ id: 123, onClick });
    const onClickProp = wrapper.prop('onClick');
    expect(onClick.callCount).to.equal(0);
    onClickProp();
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.args[0]).to.equal(123);
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
