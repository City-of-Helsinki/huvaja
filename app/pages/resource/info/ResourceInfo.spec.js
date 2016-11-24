import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ImageCarousel from 'shared/image-carousel';
import WrappedText from 'shared/wrapped-text';
import ResourceInfo from './ResourceInfo';

describe('pages/resource/info/ResourceInfo', () => {
  const image = {
    url: 'http://api.hel.fi/virkarespa/resource_image/1',
    type: 'main',
    caption: { fi: 'Caption for Image 1' },
  };
  const resource = {
    description: { fi: 'Description text' },
    images: [image],
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

    it('renders a ImageCarousel with resource images', () => {
      const imageCarousel = section.find(ImageCarousel);
      expect(imageCarousel.prop('images')).to.deep.equal(resource.images);
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
