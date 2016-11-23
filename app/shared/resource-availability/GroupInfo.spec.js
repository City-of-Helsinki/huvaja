import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import GroupInfo from './GroupInfo';
import ResourceInfoContainer from './ResourceInfoContainer';

function getWrapper(props) {
  const defaults = {
    name: 'Group name',
    resources: [],
  };
  return shallow(<GroupInfo {...defaults} {...props} />);
}

describe('shared/resource-availability/GroupInfo', () => {
  it('renders a div.group-info', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.group-info')).to.be.true;
  });

  it('renders name', () => {
    const name = 'Aleksanterinkatu 20';
    const element = getWrapper({ name }).find('.group-name');
    expect(element).to.have.length(1);
    expect(element.text()).to.equal(name);
  });

  it('renders no resources if none given', () => {
    const elements = getWrapper({ resources: [] }).find(ResourceInfoContainer);
    expect(elements).to.have.length(0);
  });

  it('renders given resources', () => {
    const resources = ['abcd', 'efgh'];
    const elements = getWrapper({ resources }).find(ResourceInfoContainer);
    expect(elements).to.have.length(2);
    expect(elements.at(0).prop('id')).to.equal(resources[0]);
    expect(elements.at(1).prop('id')).to.equal(resources[1]);
  });
});
