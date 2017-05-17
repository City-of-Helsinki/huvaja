import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Loader from 'react-loader';

import ResourceSelector from './ResourceSelector';
import ResourceItem from './ResourceItem';

describe('shared/form-field/resource-field/resource-selector/ResourceSelector', () => {
  const defaults = {
    availableResources: [
      {
        id: 'r-1',
        label: 'Unit 1 / Room 1',
        peopleCapacity: 25,
      },
      {
        id: 'r-3',
        label: 'Unit 3 / Room 3',
        peopleCapacity: 27,
      },
    ],
    isFetching: false,
    onSelect: () => null,
    unavailableResources: [
      {
        id: 'r-2',
        label: 'Unit 2 / Room 2',
        peopleCapacity: 30,
      },
    ],
  };

  function getWrapper(props) {
    return shallow(<ResourceSelector {...defaults} {...props} />);
  }

  function testResourceItem(item, resource, available) {
    expect(item.is(ResourceItem)).to.be.true;
    expect(item.prop('available')).to.equal(available);
    expect(item.prop('id')).to.equal(resource.id);
    expect(item.prop('label')).to.equal(resource.label);
    expect(item.prop('onSelect')).to.equal(defaults.onSelect);
    expect(item.prop('peopleCapacity')).to.equal(resource.peopleCapacity);
  }

  it('renders div.resource-selector', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.resource-selector')).to.be.true;
  });

  it('renders available resources', () => {
    const wrapper = getWrapper();
    const items = wrapper.find('.resource-list-available').find(ResourceItem);
    expect(items).to.have.length(2);

    testResourceItem(items.at(0), defaults.availableResources[0], true);
    testResourceItem(items.at(1), defaults.availableResources[1], true);
  });

  it('renders unavailable resources', () => {
    const wrapper = getWrapper();
    const items = wrapper.find('.resource-list-unavailable').find(ResourceItem);
    expect(items).to.have.length(1);

    testResourceItem(items.at(0), defaults.unavailableResources[0], false);
  });

  it('renders message when no resources', () => {
    const props = {
      availableResources: [],
      unavailableResources: [],
    };
    const wrapper = getWrapper(props);
    const available = wrapper.find('.resource-list-available');
    const unavailable = wrapper.find('.resource-list-unavailable');

    expect(available.contains('Ei tiloja')).to.be.true;
    expect(unavailable.contains('Ei tiloja')).to.be.true;
  });

  describe('Loader', () => {
    it('is rendered', () => {
      const loader = getWrapper().find(Loader);
      expect(loader).to.have.length(1);
    });

    it('is loaded when not fetching', () => {
      const loader = getWrapper().find(Loader);
      expect(loader.prop('loaded')).be.true;
    });

    it('is not loaded when fetching', () => {
      const loader = getWrapper({ isFetching: true }).find(Loader);
      expect(loader.prop('loaded')).be.false;
    });
  });
});
