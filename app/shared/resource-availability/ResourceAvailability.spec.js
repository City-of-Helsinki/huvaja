import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import DateSelector from './DateSelector';
import GroupedTimeline from './GroupedTimeline';
import ResourceAvailability from './ResourceAvailability';
import Sidebar from './Sidebar';

function getWrapper(props) {
  const defaults = {
    date: {},
    groups: [],
    onDateChange: () => null,
  };
  return shallow(<ResourceAvailability {...defaults} {...props} />);
}

describe('shared/resource-availability/ResourceAvailability', () => {
  it('renders a div.resource-availability', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.resource-availability')).to.be.true;
  });

  it('renders DateSelector', () => {
    const date = {};
    const onDateChange = () => null;
    const element = getWrapper({ date, onDateChange }).find(DateSelector);
    expect(element).to.have.length(1);
    expect(element.prop('value')).to.equal(date);
    expect(element.prop('onChange')).to.equal(onDateChange);
  });

  it('renders Sidebar', () => {
    const groups = [];
    const element = getWrapper({ groups }).find(Sidebar);
    expect(element).to.have.length(1);
    expect(element.prop('groups')).to.equal(groups);
  });

  it('renders GroupedTimeline', () => {
    const date = {};
    const groups = [];
    const element = getWrapper({ date, groups }).find(GroupedTimeline);
    expect(element).to.have.length(1);
    expect(element.prop('date')).to.equal(date);
    expect(element.prop('groups')).to.equal(groups);
  });
});
