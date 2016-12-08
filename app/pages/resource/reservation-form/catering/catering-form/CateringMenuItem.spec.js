import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import FontAwesome from 'react-fontawesome';
import simple from 'simple-mock';

import CateringMenuItem from './CateringMenuItem';

describe('pages/resource/reservation-form/catering/catering-form/CateringMenuItem', () => {
  function getWrapper(props) {
    const defaults = {
      item: { id: 'cmi-1', name: 'Coffee', price: 2.50 },
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
    const item = { id: 'some-id', name: 'Coffee', price: 1.2 };
    const onClick = simple.mock();
    const button = getWrapper({ item, onClick }).find('button');
    button.simulate('click');
    expect(onClick.callCount).to.equal(1);
    expect(onClick.lastCall.arg).to.equal(item.id);
  });

  it('renders the name of the item', () => {
    const item = { name: 'Apple', price: 0.5 };
    const name = getWrapper({ item }).find('.name');
    expect(name.text()).to.equal(item.name);
  });

  it('renders the price of the item with two decimals', () => {
    const item = { name: 'Coffee', price: 1.2 };
    const price = getWrapper({ item }).find('.price');
    expect(price.text()).to.equal('1.20 €');
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
