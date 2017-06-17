import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceSelectorModal from './ResourceSelectorModal';
import {
  UnconnectedResourceSelectorModalContainer as ResourceSelectorModalContainer,
} from './ResourceSelectorModalContainer';

describe('shared/modals/resource-selector/ResourceSelectorModalContainer', () => {
  const defaults = {
    allowedCateringProvider: { id: 78 },
    onHide: () => null,
    onSelect: () => null,
    selectedResource: {},
    selectedTimeRange: {},
    show: true,
    unit: {},
  };
  function getWrapper(props) {
    return shallow(<ResourceSelectorModalContainer {...defaults} {...props} />);
  }

  it('renders a ResourceSelectorModal with correct props', () => {
    const modal = getWrapper();
    expect(modal.is(ResourceSelectorModal)).to.be.true;
    expect(modal.prop('allowedCateringProvider')).to.equal(defaults.allowedCateringProvider);
    expect(modal.prop('onHide')).to.equal(defaults.onHide);
    expect(modal.prop('onSelect')).to.equal(defaults.onSelect);
    expect(modal.prop('selectedResource')).to.equal(defaults.selectedResource);
    expect(modal.prop('selectedTimeRange')).to.equal(defaults.selectedTimeRange);
    expect(modal.prop('show')).to.equal(defaults.show);
    expect(modal.prop('unit')).to.equal(defaults.unit);
  });
});
