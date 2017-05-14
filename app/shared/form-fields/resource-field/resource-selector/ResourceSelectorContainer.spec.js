import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import ResourceSelector from './ResourceSelector';
import { UnconnectedResourceSelectorContainer } from './ResourceSelectorContainer';

describe('shared/form-field/resource-field/resource-selector/ResourceSelectorContainer', () => {
  const defaults = {
    availableResources: [],
    clear: () => null,
    fetchResources: () => null,
    isFetching: false,
    onSelect: () => null,
    selectedResourceId: 'abc',
    selectedTimeRange: {
      begin: {
        date: '2017-01-15',
        time: '14:00',
      },
      end: {
        date: '2017-01-15',
        time: '15:00',
      },
    },
    unavailableResources: [],
  };

  function getWrapper(props) {
    return shallow(<UnconnectedResourceSelectorContainer {...defaults} {...props} />);
  }

  describe('rendering', () => {
    it('renders ResourceSelector with correct props', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(ResourceSelector)).to.be.true;
      expect(wrapper.prop('availableResources')).to.deep.equal(defaults.availableResources);
      expect(wrapper.prop('isFetching')).to.deep.equal(defaults.isFetching);
      expect(wrapper.prop('onSelect')).to.deep.equal(defaults.onSelect);
      expect(wrapper.prop('selectedResourceId')).to.deep.equal(defaults.selectedResourceId);
      expect(wrapper.prop('unavailableResources')).to.deep.equal(defaults.unavailableResources);
    });
  });

  describe('componentDidMount', () => {
    afterEach(() => {
      simple.restore();
    });

    it('clears selector', () => {
      const clear = simple.mock();
      const instance = getWrapper({ clear }).instance();
      instance.componentDidMount();
      expect(clear.callCount).to.equal(1);
    });

    it('fetches resources with correct params if time range exists', () => {
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources }).instance();
      instance.componentDidMount();

      expect(fetchResources.callCount).to.equal(1);
      const args = fetchResources.lastCall.args;
      expect(args[0]).to.deep.equal({
        availableBetween: '2017-01-15T12:00:00.000Z,2017-01-15T13:00:00.000Z',
      });
      expect(args[1]).to.be.false;
      expect(args[2]).to.deep.equal({ resourceSelector: true });
    });

    it('does not fetch resources if valid time range does not exists', () => {
      const selectedTimeRange = {
        begin: {
          date: '2017-01-15',
          time: '14:00',
        },
        end: {
          date: '2017-01-15',
          time: '15:--',
        },
      };
      const fetchResources = simple.mock();
      const instance = getWrapper({ fetchResources, selectedTimeRange }).instance();
      instance.componentDidMount();
      expect(fetchResources.callCount).to.equal(0);
    });
  });
});
