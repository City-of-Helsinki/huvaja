import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';

import CateringMenuItem from './CateringMenuItem';
import CateringMenu from './CateringMenu';

describe('shared/reservation-form/catering/catering-form/CateringMenu', () => {
  const defaults = {
    categories: [
      {
        id: 'c1',
        name: { fi: 'Kategoria 1' },
        products: [{ id: 'p1' }, { id: 'p2' }],
      },
    ],
    onItemClick: () => null,
    order: {},
  };

  function getWrapper(props) {
    return shallow(<CateringMenu {...defaults} {...props} />);
  }

  it('renders a .catering-menu-items', () => {
    const wrapper = getWrapper().find('.catering-menu');
    expect(wrapper).to.have.length(1);
  });

  it('renders a CateringMenuItem for every resource in props', () => {
    const items = defaults.categories[0].products;
    const cateringMenuItems = getWrapper().find(CateringMenuItem);
    expect(cateringMenuItems).to.have.length(items.length);
  });

  it('renders a Panel for each category', () => {
    const categories = [
      { id: 'c1', name: { fi: 'Kategoria 1' }, products: [] },
      { id: 'c2', name: { fi: 'Donitsit' }, products: [] },
    ];
    const panels = getWrapper({ categories }).find(Panel);
    expect(panels).to.have.length(2);
    expect(panels.at(0).prop('header')).to.equal('Kategoria 1');
    expect(panels.at(1).prop('header')).to.equal('Donitsit');
  });

  it('passes correct props to each CateringMenuItem', () => {
    const items = defaults.categories[0].products;
    const order = { 1: 5 };
    const onItemClick = () => null;
    const cateringMenuItems = getWrapper({ items, onItemClick, order }).find(CateringMenuItem);
    cateringMenuItems.forEach((cateringMenuItem, index) => {
      const expectedSelected = Boolean(order[items[index].id]);
      expect(cateringMenuItem.prop('item')).to.deep.equal(items[index]);
      expect(cateringMenuItem.prop('onClick')).to.equal(onItemClick);
      expect(cateringMenuItem.prop('selected')).to.equal(expectedSelected);
    });
  });
});
