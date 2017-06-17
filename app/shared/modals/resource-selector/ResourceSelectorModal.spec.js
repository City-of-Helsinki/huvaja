import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import ResourceSelector from 'shared/form-fields/resource-field/resource-selector';
import ResourceSelectorModal from './ResourceSelectorModal';

describe('shared/modals/resource-selector/ResourceSelectorModal', () => {
  const resource = {
    id: '33',
    name: { fi: 'Room 123' },
  };
  const defaults = {
    allowedCateringProvider: { id: 78 },
    onHide: () => null,
    onSelect: () => null,
    selectedResource: resource,
    selectedTimeRange: {
      begin: {
        date: '2017-01-15',
        time: '15:00',
      },
      end: {
        date: '2017-01-15',
        time: '16:30',
      },
    },
    show: true,
    unit: {
      name: { fi: 'Unit X' },
    },
  };

  function getWrapper(props) {
    return shallow(<ResourceSelectorModal {...defaults} {...props} />);
  }

  it('renders a modal', () => {
    expect(getWrapper().is(Modal)).to.be.true;
  });

  it('passes show prop to Modal', () => {
    expect(getWrapper({ show: true }).prop('show')).to.be.true;
    expect(getWrapper({ show: false }).prop('show')).to.be.false;
  });

  it('passes onHide prop to Modal', () => {
    expect(getWrapper().prop('onHide')).to.equal(defaults.onHide);
  });

  describe('Modal header', () => {
    function getHeaderWrapper(props) {
      return getWrapper(props).find(Modal.Header);
    }

    it('renders correct heading text', () => {
      const heading = getHeaderWrapper().find('h2');
      expect(heading.text()).to.equal('Vaihda tila');
    });
  });

  describe('Modal body', () => {
    function getBodyWrapper(props) {
      return getWrapper(props).find(Modal.Body);
    }

    it('renders unit name', () => {
      const wrapper = getBodyWrapper().find('.current-unit-name');
      expect(wrapper.text()).to.equal('Unit X');
    });

    it('renders resource name', () => {
      const wrapper = getBodyWrapper().find('.current-resource-name');
      expect(wrapper.text()).to.equal('Room 123');
    });

    it('renders date', () => {
      const wrapper = getBodyWrapper().find('.current-date');
      expect(wrapper.text()).to.equal('su 15.1.2017');
    });

    it('renders time range', () => {
      const wrapper = getBodyWrapper().find('.current-time-range');
      expect(wrapper.text()).to.equal('15:00 - 16:30');
    });

    it('renders ResourceSelector with correct props', () => {
      const wrapper = getBodyWrapper().find(ResourceSelector);
      expect(wrapper).to.have.length(1);
      expect(wrapper.prop('onSelect')).to.equal(defaults.onSelect);
      expect(wrapper.prop('selectedResourceId')).to.equal(resource.id);
      expect(wrapper.prop('selectedTimeRange')).to.deep.equal(defaults.selectedTimeRange);
      expect(wrapper.prop('allowedCateringProvider')).to.deep.equal(defaults.allowedCateringProvider);
    });

    describe('without resource, time and unit', () => {
      let bodyWrapper;

      before(() => {
        const props = {
          ...defaults,
          selectedResource: null,
          selectedTimeRange: null,
          unit: null,
        };
        bodyWrapper = getBodyWrapper(props);
      });

      it('renders unit name as empty string', () => {
        const wrapper = bodyWrapper.find('.current-unit-name');
        expect(wrapper.text()).to.equal('');
      });

      it('renders resource name as empty string', () => {
        const wrapper = bodyWrapper.find('.current-resource-name');
        expect(wrapper.text()).to.equal('');
      });

      it('renders date as empty string', () => {
        const wrapper = bodyWrapper.find('.current-date');
        expect(wrapper.text()).to.equal('');
      });

      it('renders time range as empty string', () => {
        const wrapper = bodyWrapper.find('.current-time-range');
        expect(wrapper.text()).to.equal('');
      });
    });
  });
});
