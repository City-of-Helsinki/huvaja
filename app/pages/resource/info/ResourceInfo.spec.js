import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import WrappedText from 'shared/wrapped-text';
import ResourceInfo from './ResourceInfo';

describe('pages/resource/info/ResourceInfo', () => {
  const resource = {
    description: { fi: 'Description text' }
    name: { fi: 'Huone' },
    peopleCapacity: 3,
    type: { name: { fi: 'Työpiste' } },
  };
  const unit = {
    name: { fi: 'Rakennus' },
    streetAddress: { fi: 'Testinkatu' },
  };

  function getWrapper(props) {
    const defaults = {
      resource,
      unit,
    };
    return shallow(<ResourceInfo {...defaults} {...props} />);
  }

  describe('header', () => {
    let header;
    before(() => {
      header = getWrapper().find('header');
    });

    it('renders unit name', () => {
      const unitName = header.find('.unit-name');
      expect(unitName.text()).to.equal(unit.name.fi);
    });

    it('renders resource name', () => {
      const resourceName = header.find('.resource-name');
      expect(resourceName.text()).to.equal(resource.name.fi);
    });

    it('renders resource address', () => {
      const unitAddress = header.find('.unit-address');
      expect(unitAddress.text()).to.equal(unit.streetAddress.fi);
    });
  });
  describe('resource-details section', () => {
    let section;
    before(() => {
      section = getWrapper().find('section.resource-details');
    });

    it('renders resource type', () => {
      const resourceType = section.find('.resource-type');
      expect(resourceType.text()).to.equal(resource.type.name.fi);
    });

    it('renders resource people capacity', () => {
      const resourceCapacity = section.find('.resource-people-capacity');
      expect(resourceCapacity.text()).to.equal(`Henkilömäärä: ${resource.peopleCapacity}`);
    });

    it('renders resource description', () => {
      const resourceDescription = section.find('.resource-description');
      const wrappedText = resourceDescription.find(WrappedText);
      expect(wrappedText.prop('text')).to.equal(resource.description.fi);
    });
  });
});
