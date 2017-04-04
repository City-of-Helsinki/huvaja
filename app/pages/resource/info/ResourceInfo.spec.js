import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Label from 'react-bootstrap/lib/Label';
import simple from 'simple-mock';

import FavoriteButton from 'shared/favorite-button';
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
    id: 'asdf',
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
      resource,
      showResourceImages: () => null,
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

    it('renders resource description', () => {
      const resourceDescription = getWrapper().find('.resource-description');
      const wrappedText = resourceDescription.find(WrappedText);
      expect(wrappedText.prop('text')).to.equal(resource.description.fi);
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
  });

  describe('resource-details section', () => {
    function getSectionWrapper(props) {
      return getWrapper(props).find('section.resource-details');
    }

    it('renders resource type', () => {
      const resourceType = getSectionWrapper().find('.resource-type');
      expect(resourceType.children().text()).to.equal(resource.type.name.fi);
    });

    it('renders resource people capacity', () => {
      const resourceCapacity = getSectionWrapper().find('.resource-people-capacity');
      expect(resourceCapacity.text()).to.equal(`Paikkoja: ${resource.peopleCapacity}`);
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

  describe('image container', () => {
    function getImageContainerWrapper(props) {
      return getWrapper(props).find('.resource-image-container');
    }

    it('is rendered if resource has images', () => {
      expect(getImageContainerWrapper()).to.have.length(1);
    });

    it('is not rendered on mobile', () => {
      expect(getImageContainerWrapper().hasClass('hidden-xs')).to.be.true;
    });

    it('is not rendered if resource has no images', () => {
      const props = {
        resource: {
          ...resource,
          images: [],
        },
      };
      expect(getImageContainerWrapper(props)).to.have.length(0);
    });

    it('renders first resource image', () => {
      const imageWrapper = getImageContainerWrapper().find('.resource-image');
      expect(imageWrapper.prop('src')).to.deep.equal(resource.images[0].url);
    });

    it('opens modal on click', () => {
      const showResourceImages = simple.mock();
      const wrapper = getImageContainerWrapper({ showResourceImages });
      wrapper.simulate('click');
      expect(showResourceImages.callCount).to.equal(1);
      expect(showResourceImages.lastCall.arg).to.equal(resource.id);
    });
  });

  describe('"show images" button', () => {
    function getButtonWrapper(props) {
      return getWrapper(props).find('.show-images-mobile');
    }

    it('is rendered if resource has images', () => {
      expect(getButtonWrapper()).to.have.length(1);
    });

    it('is only rendered on mobile', () => {
      expect(getButtonWrapper().hasClass('visible-xs')).to.be.true;
    });

    it('is not rendered if resource has no images', () => {
      const props = {
        resource: {
          ...resource,
          images: [],
        },
      };
      expect(getButtonWrapper(props)).to.have.length(0);
    });

    it('opens modal on click', () => {
      const showResourceImages = simple.mock();
      const wrapper = getButtonWrapper({ showResourceImages });
      wrapper.simulate('click');
      expect(showResourceImages.callCount).to.equal(1);
      expect(showResourceImages.lastCall.arg).to.equal(resource.id);
    });
  });
});
