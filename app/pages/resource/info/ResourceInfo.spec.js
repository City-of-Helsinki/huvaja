import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';

import FavoriteButton from 'shared/favorite-button';
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
    equipment: [{ name: { fi: 'projector' } }, { name: { fi: 'whiteboard' } }],
    images: [image],
    name: { fi: 'Huone' },
    peopleCapacity: 3,
    type: { name: { fi: 'Työpiste' } },
  };
  const unit = {
    addressZip: '99999',
    municipality: 'Helsinki',
    name: { fi: 'Rakennus' },
    streetAddress: { fi: 'Testinkatu' },
  };

  function getWrapper(props) {
    const defaults = {
      isLoggedIn: true,
      resource,
      unit,
    };
    return shallow(<ResourceInfo {...defaults} {...props} />);
  }

  describe('header', () => {
    function getHeaderWrapper(props) {
      return getWrapper(props).find('header');
    }

    it('renders unit name', () => {
      const unitName = getHeaderWrapper().find('.unit-name');
      expect(unitName.text()).to.equal(unit.name.fi);
    });

    it('renders resource name', () => {
      const resourceName = getHeaderWrapper().find('.resource-name');
      expect(resourceName.text()).to.equal(resource.name.fi);
    });

    it('renders resource address', () => {
      const unitAddress = getHeaderWrapper().find('.unit-address');
      expect(unitAddress.text()).to.contain(unit.streetAddress.fi);
      expect(unitAddress.text()).to.contain(unit.municipality);
      expect(unitAddress.text()).to.contain(unit.addressZip);
    });

    it('is rendered when user is logged in', () => {
      expect(getHeaderWrapper({ isLoggedIn: true })).to.have.length(1);
    });

    it('is rendered when user is not logged in', () => {
      expect(getHeaderWrapper({ isLoggedIn: false })).to.have.length(1);
    });
  });

  describe('FavoriteButton', () => {
    function getFavoriteWrapper(props) {
      return getWrapper(props).find(FavoriteButton);
    }

    it('gets rendered if user is logged in', () => {
      expect(getFavoriteWrapper({ isLoggedIn: true })).to.have.length(1);
    });

    it('gets resource prop', () => {
      expect(getFavoriteWrapper({ isLoggedIn: true }).prop('resource')).to.deep.equal(resource);
    });

    it('does not get rendered if user is not logged in', () => {
      expect(getFavoriteWrapper({ isLoggedIn: false })).to.have.length(0);
    });
  });

  describe('resource-details section', () => {
    function getSectionWrapper(props) {
      return getWrapper(props).find('section.resource-details');
    }

    it('renders a ImageCarousel with resource images', () => {
      const imageCarousel = getSectionWrapper().find(ImageCarousel);
      expect(imageCarousel.prop('images')).to.deep.equal(resource.images);
    });

    it('renders resource type', () => {
      const resourceType = getSectionWrapper().find('.resource-type');
      expect(resourceType.text()).to.equal(resource.type.name.fi);
    });

    it('renders resource people capacity', () => {
      const resourceCapacity = getSectionWrapper().find('.resource-people-capacity');
      expect(resourceCapacity.text()).to.equal(`Henkilömäärä: ${resource.peopleCapacity}`);
    });

    it('renders resource description', () => {
      const resourceDescription = getSectionWrapper().find('.resource-description');
      const wrappedText = resourceDescription.find(WrappedText);
      expect(wrappedText.prop('text')).to.equal(resource.description.fi);
    });

    it('renders resource equipment', () => {
      const resourceEquipment = getSectionWrapper().find('.resource-equipment');
      const nameLabel = resourceEquipment.find('.details-label');
      expect(nameLabel.text()).to.equal('Varustelu: ');
      const equipmentLabels = resourceEquipment.find(Label);
      expect(equipmentLabels).to.have.length(2);
      expect(equipmentLabels.children().get(0)).to.equal('projector');
      expect(equipmentLabels.children().get(1)).to.equal('whiteboard');
    });

    it('does not render resource equipment if empty', () => {
      const unequipedResource = Object.assign({}, resource, { equipment: undefined });
      const resourceEquipment = (
        getSectionWrapper({ resource: unequipedResource }).find('.resource-equipment')
      );
      expect(resourceEquipment).to.have.length(0);
    });
  });
});
