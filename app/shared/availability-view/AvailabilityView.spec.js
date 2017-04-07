import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import DateSelector from './DateSelector';
import TimelineGroups from './TimelineGroups';
import AvailabilityView from './AvailabilityView';
import Sidebar from './Sidebar';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
    onDateChange: () => null,
  };
  return shallow(<AvailabilityView {...defaults} {...props} />);
}

describe('shared/availability-view/AvailabilityView', () => {
  it('renders a div.availability-view', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-view')).to.be.true;
  });

  it('renders DateSelector', () => {
    const date = '2016-11-12';
    const onDateChange = () => null;
    const element = getWrapper({ date, onDateChange }).find(DateSelector);
    expect(element).to.have.length(1);
    expect(element.prop('value')).to.equal(date);
    expect(element.prop('onChange')).to.equal(onDateChange);
  });

  it('renders Sidebar', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(Sidebar);
    expect(element).to.have.length(1);
    expect(element.prop('date')).to.equal(date);
    expect(element.prop('groups')).to.equal(groups);
  });

  it('renders TimelineGroups', () => {
    const date = '2016-11-12';
    const groups = [];
    const element = getWrapper({ date, groups }).find(TimelineGroups);
    expect(element).to.have.length(1);
    expect(element.prop('date')).to.equal(date);
    expect(element.prop('groups')).to.equal(groups);
  });

  describe('handleAvailabilityTimelineMouseEnter', () => {
    beforeEach(() => {
      simple.mock(window, 'clearTimeout').returnWith();
    });

    afterEach(() => {
      simple.restore();
    });

    it('sets the resource id to the state', () => {
      const wrapper = getWrapper();
      wrapper.instance().handleAvailabilityTimelineMouseEnter('some-id');
      expect(wrapper.state('highlightedResourceId')).to.equal('some-id');
      expect(window.clearTimeout.called).to.be.false;
    });

    it('clears the timeout', () => {
      const wrapper = getWrapper();
      const timeoutId = 3981;
      const instance = wrapper.instance();
      instance.clearHighlightedTimeTimeout = timeoutId;
      instance.handleAvailabilityTimelineMouseEnter('some-id');
      expect(window.clearTimeout.callCount).to.equal(1);
      expect(window.clearTimeout.lastCall.arg).to.equal(timeoutId);
      expect(instance.clearHighlightedTimeTimeout).to.be.null;
    });
  });

  describe('handleAvailabilityTimelineMouseLeave', () => {
    const timeoutId = 7563;

    beforeEach(() => {
      simple.mock(window, 'setTimeout').returnWith(timeoutId);
    });

    afterEach(() => {
      simple.restore();
    });

    it('calls setTimeout', () => {
      const wrapper = getWrapper();
      wrapper.instance().handleAvailabilityTimelineMouseLeave();
      expect(window.setTimeout.callCount).to.equal(1);
      expect(wrapper.instance().clearHighlightedTimeTimeout).to.equal(timeoutId);
      const args = window.setTimeout.lastCall.args;
      expect(args).to.have.length(2);
      expect(args[0]).to.be.a('function');
      expect(args[1]).to.equal(50);
    });
  });
});
