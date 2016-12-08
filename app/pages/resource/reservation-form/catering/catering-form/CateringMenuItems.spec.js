import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import CateringMenuItem from './CateringMenuItem';
import CateringMenuItems from './CateringMenuItems';

describe('pages/resource/reservation-form/catering/catering-form/CateringMenuItems', () => {
  function getWrapper(props) {
    const defaults = {
      items: [{ id: 1 }, { id: 2 }],
      onItemClick: () => null,
      order: {},
    };
    return shallow(<CateringMenuItems {...defaults} {...props} />);
  }

  it('renders a div.catering-menu-items', () => {
    const div = getWrapper().find('div.catering-menu-items');
    expect(div).to.have.length(1);
  });

  it('renders a CateringMenuItem for every resource in props', () => {
    const items = [{ id: 1 }, { id: 2 }];
    const cateringMenuItems = getWrapper({ items }).find(CateringMenuItem);
    expect(cateringMenuItems).to.have.length(items.length);
  });

  it('passes correct props to each CateringMenuItem', () => {
    const items = [{ id: 1 }, { id: 2 }];
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
