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
        hasBadCateringProvider: true,
        id: 'r-1',
        label: 'Unit 1 / Room 1',
        peopleCapacity: 25,
      },
      {
        hasBadCateringProvider: false,
        id: 'r-3',
        label: 'Unit 3 / Room 3',
        peopleCapacity: 27,
      },
    ],
    isFetching: false,
    onSelect: () => null,
    unavailableResources: [
      {
        hasBadCateringProvider: false,
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
    expect(item.prop('hasBadCateringProvider')).to.equal(resource.hasBadCateringProvider);
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

  describe('when given resources prop', () => {
    function getResourcesWrapper() {
      const props = {
        resources: [{
          hasBadCateringProvider: false,
          id: '1',
          label: 'U1 / R1',
          peopleCapacity: 1,
        }],
      };
      return getWrapper(props);
    }

    it('does not render available resources', () => {
      const wrapper = getResourcesWrapper();
      expect(wrapper.find('.resource-list-available')).to.have.length(0);
    });

    it('does not render unavailable resources', () => {
      const wrapper = getResourcesWrapper();
      expect(wrapper.find('.resource-list-unavailable')).to.have.length(0);
    });

    it('renders all resources in one list', () => {
      const wrapper = getResourcesWrapper();
      const list = wrapper.find('.resource-list-all');
      const items = list.find(ResourceItem);
      expect(list).to.have.length(1);
      expect(items).to.have.length(1);
      testResourceItem(
        items.at(0),
        {
          id: '1',
          label: 'U1 / R1',
          peopleCapacity: 1,
          hasBadCateringProvider: false,
        },
        true
      );
    });
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
