import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import CateringModal from './CateringModal';
import CateringOrderTable from './CateringOrderTable';
import {
  selector,
  UnconnectedCateringSectionContainer as CateringSectionContainer,
} from './CateringSectionContainer';

describe.skip('shared/reservation-form/catering/CateringSectionContainer', () => {
  function getWrapper(props) {
    const defaults = {
      servingTime: '10:00',
      orderItems: [
        { id: 'cmi-1', name: { fi: 'Kahvi' }, price: 1, quantity: 2 },
      ],
    };
    return shallow(<CateringSectionContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    const cateringProducts = {
      1: { id: 1, name: { fi: 'Kahvi' }, price: 2 },
      2: { id: 2, name: { fi: 'Kokis' }, price: 3.5 },
    };
    const cateringData = { order: { 1: 2 }, time: '11:30' };
    function getState() {
      return {
        data: { cateringProducts },
        catering: cateringData,
      };
    }

    it('returns orderItems from the state', () => {
      const selected = selector(getState());
      const expected = [{ id: 1, name: { fi: 'Kahvi' }, price: 2, quantity: 2 }];
      expect(selected.orderItems).to.deep.equal(expected);
    });

    it('returns servingTime from the state', () => {
      const selected = selector(getState());
      expect(selected.servingTime).to.deep.equal(cateringData.servingTime);
    });
  });

  describe('render', () => {
    it('renders a div.catering-section', () => {
      const div = getWrapper().find('div.catering-section');
      expect(div).to.have.length(1);
    });

    describe('if order has not been made', () => {
      const orderItems = [];

      function getOrderNotMadeWrapper() {
        return getWrapper({ orderItems });
      }

      it('does not render CateringOrderTable', () => {
        const cateringOrderTable = getOrderNotMadeWrapper().find(CateringOrderTable);
        expect(cateringOrderTable).to.have.length(0);
      });

      it('renders Button with text "Tilaa tarjoilut"', () => {
        const wrapper = getOrderNotMadeWrapper();
        const button = wrapper.find(Button);
        expect(button).to.have.length(1);
        expect(button.prop('children')).to.equal('Tilaa tarjoilut');
        expect(button.prop('onClick')).to.equal(wrapper.instance().openCateringModal);
      });
    });

    describe('if order has been made', () => {
      const orderItems = [
        { id: 'cmi-1', name: { fi: 'Kahvi' }, price: 1, quantity: 2 },
      ];
      function getOrderNotMadeWrapper() {
        return getWrapper({ orderItems });
      }

      it('renders CateringOrderTable with correct data', () => {
        const cateringOrderTable = getOrderNotMadeWrapper().find(CateringOrderTable);
        expect(cateringOrderTable).to.have.length(1);
        expect(cateringOrderTable.prop('items')).to.deep.equal(orderItems);
      });

      it('renders Button for opening modal with text "Muokkaa tarjoiluja"', () => {
        const wrapper = getOrderNotMadeWrapper();
        const button = wrapper.find(Button);
        expect(button).to.have.length(1);
        expect(button.prop('children')).to.equal('Muokkaa tarjoiluja');
        expect(button.prop('onClick')).to.equal(wrapper.instance().openCateringModal);
      });
    });

    it('renders CateringModal with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const cateringModal = wrapper.find(CateringModal);
      expect(cateringModal).to.have.length(1);
      expect(cateringModal.prop('onClose')).to.equal(instance.closeCateringModal);
      expect(cateringModal.prop('show')).to.equal(instance.state.showCateringModal);
    });
  });

  describe('closeCateringModal', () => {
    it('sets state.showCateringModal to false', () => {
      const instance = getWrapper().instance();
      instance.state.showCateringModal = true;
      instance.closeCateringModal();
      expect(instance.state.showCateringModal).to.equal(false);
    });
  });

  describe('openCateringModal', () => {
    it('sets state.showCateringModal to true', () => {
      const instance = getWrapper().instance();
      instance.state.showCateringModal = false;
      instance.openCateringModal();
      expect(instance.state.showCateringModal).to.equal(true);
    });
  });
});
