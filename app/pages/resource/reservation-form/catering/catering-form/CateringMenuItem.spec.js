import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
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

  it('renders a "plus" glyphicon if item is not selected', () => {
    const glyphicon = getWrapper({ selected: false }).find(Glyphicon);
    expect(glyphicon).to.have.length(1);
    expect(glyphicon.prop('glyph')).to.equal('plus');
  });

  it('renders a "minus" glyphicon if item is selected', () => {
    const glyphicon = getWrapper({ selected: true }).find(Glyphicon);
    expect(glyphicon).to.have.length(1);
    expect(glyphicon.prop('glyph')).to.equal('minus');
  });
});
