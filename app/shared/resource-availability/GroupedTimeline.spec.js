import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import GroupedTimeline from './GroupedTimeline';
import GroupTimeline from './GroupTimeline';

function getWrapper(props) {
  const defaults = {
    date: moment('2016-01-01'),
    groups: [],
  };
  return shallow(<GroupedTimeline {...defaults} {...props} />);
}

describe('shared/resource-availability/GroupedTimeline', () => {
  it('renders a div.grouped-timeline', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.grouped-timeline')).to.be.true;
  });

  it('renders no groups if none given', () => {
    const elements = getWrapper({ groups: [] }).find(GroupTimeline);
    expect(elements).to.have.length(0);
  });

  it('renders each group', () => {
    const groups = [{ name: 'A', resources: [] }, { name: 'B', resources: [] }];
    const elements = getWrapper({ groups }).find(GroupTimeline);
    expect(elements).to.have.length(2);
  });
});
