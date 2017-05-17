import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceField from './ResourceField';
import { UnconnectedResourceFieldContainer } from './ResourceFieldContainer';

describe('shared/form-field/resource-field/ResourceFieldContainer', () => {
  const defaults = {
    id: 'resource',
    controlProps: {},
    hideSelector: () => null,
    label: 'Tila',
    showSelector: () => null,
    validationState: 'success',
  };

  function getWrapper() {
    return shallow(<UnconnectedResourceFieldContainer {...defaults} />);
  }

  it('renders ResourceField with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper.is(ResourceField)).to.be.true;
    expect(wrapper.props()).to.deep.equal(defaults);
  });
});
