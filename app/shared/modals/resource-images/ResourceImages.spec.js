import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';

import ImageCarousel from 'shared/image-carousel';
import ResourceImages from './ResourceImages';

describe('shared/modal/ResourceImages', () => {
  const resource = {
    images: [
      { url: 'huone.png' },
    ],
    name: { fi: 'Huone' },
  };
  const defaults = {
    onHide: () => {},
    resource,
    show: true,
  };

  function getWrapper(props) {
    return shallow(<ResourceImages {...defaults} {...props} />);
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

    it('renders resource name', () => {
      const resourceName = getHeaderWrapper().find('h2');
      expect(resourceName.text()).to.equal(resource.name.fi);
    });
  });

  describe('Modal body', () => {
    function getBodyWrapper(props) {
      return getWrapper(props).find(Modal.Body);
    }

    it('renders ImageCarousel with correct props', () => {
      const carousel = getBodyWrapper().find(ImageCarousel);
      expect(carousel).to.have.length(1);
      expect(carousel.prop('images')).to.deep.equal(defaults.resource.images);
    });
  });
});
