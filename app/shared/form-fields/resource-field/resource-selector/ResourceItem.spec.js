import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceItem from './ResourceItem';

describe('shared/form-field/resource-field/resource-selector/ResourceItem', () => {
  const defaults = {
    available: true,
    id: 'resource',
    label: 'Unit 1 / Room 1',
    onSelect: () => null,
    peopleCapacity: 25,
  };

  function getWrapper(props) {
    return shallow(<ResourceItem {...defaults} {...props} />);
  }

  it('renders div.resource-item', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.resource-item')).to.be.true;
  });

  it('has "unavailable" class if not available', () => {
    const wrapper = getWrapper({ available: false });
    expect(wrapper.hasClass('unavailable')).to.be.true;
  });

  it('renders label', () => {
    const capacity = getWrapper().find('.resource-item-label');
    expect(capacity.text()).to.equal(defaults.label);
  });

  it('renders people capacity', () => {
    const capacity = getWrapper().find('.capacity');
    expect(capacity.contains(defaults.peopleCapacity)).to.be.true;
  });
});
