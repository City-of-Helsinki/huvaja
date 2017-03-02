import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import TimelineGroups from './TimelineGroups';
import TimelineGroup from './TimelineGroup';

function getWrapper(props) {
  const defaults = {
    date: '2016-01-01',
    groups: [],
  };
  return shallow(<TimelineGroups {...defaults} {...props} />);
}

describe('shared/availability-view/TimelineGroups', () => {
  it('renders a div.timeline-groups', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    expect(wrapper.is('div.timeline-groups')).to.be.true;
    expect(wrapper.prop('onScroll')).to.equal(instance.handleScroll);
  });

  it('renders no groups if none given', () => {
    const elements = getWrapper({ groups: [] }).find(TimelineGroup);
    expect(elements).to.have.length(0);
  });

  it('renders each group', () => {
    const groups = [{ name: 'A', resources: [] }, { name: 'B', resources: [] }];
    const elements = getWrapper({ groups }).find(TimelineGroup);
    expect(elements).to.have.length(2);
  });

  describe('componentDidMount', () => {
    before(() => {
      simple.mock(window, 'addEventListener');
    });

    after(() => {
      simple.restore();
    });

    it('adds a scroll event listener', () => {
      window.addEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentDidMount();
      expect(window.addEventListener.callCount).to.equal(1);
      expect(window.addEventListener.lastCall.args).to.deep.equal(['scroll', instance.handleScroll]);
    });
  });

  describe('componentWillUnmount', () => {
    before(() => {
      simple.mock(window, 'removeEventListener');
    });

    after(() => {
      simple.restore();
    });

    it('removes the scroll event listener', () => {
      window.removeEventListener.reset();
      const instance = getWrapper().instance();
      instance.componentWillUnmount();
      expect(window.removeEventListener.callCount).to.equal(1);
      expect(window.removeEventListener.lastCall.args).to.deep.equal(['scroll', instance.handleScroll]);
    });
  });
});
