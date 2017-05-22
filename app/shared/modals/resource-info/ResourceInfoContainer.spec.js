import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceInfoModal from './ResourceInfo';
import { UnconnectedResourceInfoContainer as ResourceInfoContainer } from './ResourceInfoContainer';

describe('shared/modals/resource-info/ResourceInfoContainer', () => {
  const defaults = {
    hideResourceImages: () => null,
    hideResourceInfo: () => null,
    onHide: () => null,
    resource: { id: 'r-1' },
    show: true,
    showResourceImages: () => null,
    unit: { id: 'u-1' },
  };

  function getWrapper(props) {
    return shallow(<ResourceInfoContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a ResourceInfoModal', () => {
      const resourceInfo = getWrapper().find(ResourceInfoModal);
      expect(resourceInfo).to.have.length(1);
      expect(resourceInfo.prop('hideResourceImages')).to.equal(defaults.hideResourceImages);
      expect(resourceInfo.prop('hideResourceInfo')).to.equal(defaults.hideResourceInfo);
      expect(resourceInfo.prop('onHide')).to.equal(defaults.onHide);
      expect(resourceInfo.prop('resource')).to.equal(defaults.resource);
      expect(resourceInfo.prop('show')).to.equal(defaults.show);
      expect(resourceInfo.prop('showResourceImages')).to.equal(defaults.showResourceImages);
      expect(resourceInfo.prop('unit')).to.equal(defaults.unit);
    });
  });
});
