import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceInfoContainer, { ResourceInfo, selector } from './ResourceInfoContainer';

function getState() {
  return {
    data: {
      resources: {
        123456: {
          id: '123456',
          name: { fi: 'Resource Name' },
          peopleCapacity: 9,
          extra: 'attribute',
        },
      },
    },
  };
}

describe('shared/resource-availability/ResourceInfoContainer', () => {
  describe('container', () => {
    function getWrapper(props) {
      const defaults = { id: '123456', store: { getState } };
      return shallow(<ResourceInfoContainer {...defaults} {...props} />);
    }

    it('renders a ResourceInfo', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(ResourceInfo)).to.be.true;
    });
  });

  describe('component', () => {
    function getWrapper(props) {
      const defaults = { name: 'Resource name', peopleCapacity: 19 };
      return shallow(<ResourceInfo {...defaults} {...props} />);
    }

    it('renders a div.resource-info', () => {
      const wrapper = getWrapper();
      expect(wrapper.is('div.resource-info')).to.be.true;
    });

    it('renders the name', () => {
      const name = getWrapper({ name: 'Room 1' }).find('.name');
      expect(name).to.have.length(1);
      expect(name.text()).to.equal('Room 1');
    });

    it('renders the capacity', () => {
      const capacity = getWrapper({ peopleCapacity: 3 }).find('.capacity');
      expect(capacity).to.have.length(1);
      expect(capacity.text()).to.equal('3');
    });
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: '123456' };
      return selector()(getState(), { ...defaults, ...props });
    }

    it('returns resource info', () => {
      const actual = getSelected();
      expect(actual).to.deep.equal({
        name: 'Resource Name',
        peopleCapacity: 9,
      });
    });
  });
});
