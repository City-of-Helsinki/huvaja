import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import ResourceInfo from './ResourceInfo';

describe('pages/resource/info/ResourceInfo', () => {
  const resource = {
    name: { fi: 'Huone' },
  };
  const unit = {
    name: { fi: 'Rakennus' },
  };

  function getWrapper(props) {
    const defaults = {
      resource,
      unit,
    };
    return shallow(<ResourceInfo {...defaults} {...props} />);
  }

  it('renders unit name', () => {
    const unitName = getWrapper().find('.unit-name');
    expect(unitName.text()).to.equal(unit.name.fi);
  });

  it('renders resource name', () => {
    const resourceName = getWrapper().find('.resource-name');
    expect(resourceName.text()).to.equal(resource.name.fi);
  });
});
