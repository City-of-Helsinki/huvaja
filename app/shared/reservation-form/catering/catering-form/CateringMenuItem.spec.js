import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import simple from 'simple-mock';

import CateringMenuItem from './CateringMenuItem';

describe('shared/reservation-form/catering/catering-form/CateringMenuItem', () => {
  function getWrapper(props) {
    const defaults = {
      item: {
        id: 'cmi-1',
        name: { fi: 'Kahvi' },
        description: null,
      },
      onClick: () => null,
      selected: false,
    };
    return shallow(<CateringMenuItem {...defaults} {...props} />);
  }

  it('renders a button', () => {
    const button = getWrapper().find('button');
    expect(button).to.have.length(1);
  });

  it('clicking the button calls props.onClick with item id', () => {
    const item = { id: 'some-id', name: { fi: 'Kahvi' } };
    const onClick = simple.mock();
    const button = getWrapper({ item, onClick }).find('button');
    button.simulate('click');
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.arg).to.equal(item.id);
  });

  it('renders the name of the item', () => {
    const item = { name: { fi: 'Omena' } };
    const name = getWrapper({ item }).find('.name');
    expect(name.text()).to.equal(item.name.fi);
  });

  it('renders the description of the item', () => {
    const item = { name: { fi: 'Kahvi' }, description: { fi: 'Herkullinen' } };
    const description = getWrapper({ item }).find('.description');
    expect(description.text()).to.equal(item.description.fi);
  });

  it('renders a "plus" icon if item is not selected', () => {
    const icon = getWrapper({ selected: false }).find(FontAwesome);
    expect(icon).to.have.length(1);
    expect(icon.prop('name')).to.equal('plus');
  });

  it('renders a "minus" icon if item is selected', () => {
    const icon = getWrapper({ selected: true }).find(FontAwesome);
    expect(icon).to.have.length(1);
    expect(icon.prop('name')).to.equal('minus');
  });
});
