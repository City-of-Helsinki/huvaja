import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import ResourceInfo from 'shared/resource-info';
import ResourceInfoModal from './ResourceInfo';

describe('shared/modals/reservation-cancel/ResourceInfo', () => {
  const resource = { id: 'r-1' };
  const unit = { id: 'u-1' };
  const defaults = {
    hideResourceImages: () => null,
    hideResourceInfo: () => null,
    onHide: () => {},
    resource,
    show: true,
    showResourceImages: () => null,
    unit,
  };

  function getWrapper(props) {
    return shallow(<ResourceInfoModal {...defaults} {...props} />);
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

  it('renders close button', () => {
    const button = getWrapper().find(Button);
    expect(button.prop('onClick')).to.equal(defaults.hideResourceInfo);
  });

  describe('ResourceInfo', () => {
    function getInfoWrapper(props) {
      return getWrapper(props).find(ResourceInfo);
    }

    it('is rendered with correct props', () => {
      const info = getInfoWrapper();
      expect(info).to.have.length(1);
      expect(info.prop('hideResourceImages')).to.equal(defaults.hideResourceImages);
      expect(info.prop('resource')).to.equal(defaults.resource);
      expect(info.prop('resourceSearchUrl')).to.be.null;
      expect(info.prop('showResourceImages')).to.equal(defaults.showResourceImages);
      expect(info.prop('unit')).to.equal(defaults.unit);
    });

    it('is not rendered when resource is missing', () => {
      const info = getInfoWrapper({ resource: null });
      expect(info).to.have.length(0);
    });

    it('is not rendered when unit is missing', () => {
      const info = getInfoWrapper({ unit: null });
      expect(info).to.have.length(0);
    });
  });
});
