import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import DateSelector from './DateSelector';
import TimelineGroup from './TimelineGroups/TimelineGroup';
import SingleAvailabilityView from './SingleAvailabilityView';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    resource: 'qwerty',
    onDateChange: () => null,
  };
  return shallow(<SingleAvailabilityView {...defaults} {...props} />);
}

describe('shared/availability-view/SingleAvailabilityView', () => {
  it('renders a div.availability-view.availability-view-single', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.availability-view.availability-view-single')).to.be.true;
  });

  it('renders DateSelector', () => {
    const date = '2016-11-12';
    const onDateChange = () => null;
    const element = getWrapper({ date, onDateChange }).find(DateSelector);
    expect(element).to.have.length(1);
    expect(element.prop('value')).to.equal(date);
    expect(element.prop('onChange')).to.equal(onDateChange);
  });

  it('supports hiding DateSelector', () => {
    const element = getWrapper({ hideDateSelector: true }).find(DateSelector);
    expect(element).to.have.length(0);
  });

  it('renders TimelineGroup', () => {
    const timelineGroup = getWrapper().find(TimelineGroup);
    expect(timelineGroup).to.have.length(1);
  });
});
