import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import CateringOrderTable from 'shared/catering-order-table';
import { getState } from 'utils/testUtils';
import CateringModal from './CateringModal';
import {
  selector,
  UnconnectedCateringSectionContainer as CateringSectionContainer,
} from './CateringSectionContainer';

describe('shared/reservation-form/catering/CateringSectionContainer', () => {
  const defaults = {
    controlProps: {
      onChange: () => null,
    },
    servingTime: '10:00',
    orderItems: [
      { id: 'cmi-1', name: { fi: 'Kahvi' }, price: 1, quantity: 2 },
    ],
  };
  function getWrapper(props) {
    return shallow(<CateringSectionContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    const cateringProducts = {
      1: { id: 1, name: { fi: 'Kahvi' }, price: 2 },
      2: { id: 2, name: { fi: 'Kokis' }, price: 3.5 },
    };
    const cateringOrder = { order: { 1: 2 }, servingTime: '11:30' };
    const defaultState = {
      data: { cateringProducts },
      'form.resourceReservation.values': { cateringOrder },
    };

    it('returns orderItems from the state', () => {
      const selected = selector(getState(defaultState));
      const expected = [{ id: 1, name: { fi: 'Kahvi' }, price: 2, quantity: 2 }];
      expect(selected.orderItems).to.deep.equal(expected);
    });

    it('returns empty orderItems when products not fetched', () => {
      const state = {
        ...defaultState,
        data: {
          ...defaultState.data,
          cateringProducts: {},
        },
      };
      const selected = selector(getState(state));
      expect(selected.orderItems).to.deep.equal([]);
    });

    it('returns servingTime from the state', () => {
      const selected = selector(getState(defaultState));
      expect(selected.servingTime).to.deep.equal(cateringOrder.servingTime);
    });
  });

  describe('render', () => {
    it('renders a div.catering-section', () => {
      const div = getWrapper().find('div.catering-section');
      expect(div).to.have.length(1);
    });

    describe('if order has not been made', () => {
      const orderItems = [];

      function getOrderNotMadeWrapper(props) {
        return getWrapper({ orderItems, ...props });
      }

      it('does not render CateringOrderTable', () => {
        const cateringOrderTable = getOrderNotMadeWrapper().find(CateringOrderTable);
        expect(cateringOrderTable).to.have.length(0);
      });

      it('renders correct text if no orders', () => {
        const paragraph = getOrderNotMadeWrapper().find('p');
        expect(paragraph.text()).to.equal('Ei tarjoilua');
      });

      describe('reason for disabling', () => {
        const className = '.catering-section-disabled-reason';

        it('is shown if disabledReason control prop exists', () => {
          const disabledReason = 'Reservation is recurring.';
          const controlProps = {
            ...defaults.controlProps,
            disabledReason,
          };
          const wrapper = getOrderNotMadeWrapper({ controlProps });
          const reason = wrapper.find(className);
          expect(reason).to.have.length(1);
          expect(reason.text()).to.equal(disabledReason);
        });

        it('is not shown if no disabledReason control prop', () => {
          const wrapper = getOrderNotMadeWrapper();
          const reason = wrapper.find(className);
          expect(reason).to.have.length(0);
        });
      });

      describe('button', () => {
        it('is rendered with text "Tilaa tarjoilut"', () => {
          const wrapper = getOrderNotMadeWrapper();
          const button = wrapper.find(Button);
          expect(button).to.have.length(1);
          expect(button.prop('children')).to.equal('Tilaa tarjoilut');
          expect(button.prop('onClick')).to.equal(wrapper.instance().openCateringModal);
          expect(button.prop('disabled')).to.be.false;
        });

        it('is disabled if disabledReason control prop exists', () => {
          const disabledReason = 'Reservation is recurring.';
          const controlProps = {
            ...defaults.controlProps,
            disabledReason,
          };
          const wrapper = getOrderNotMadeWrapper({ controlProps });
          const button = wrapper.find(Button);
          expect(button).to.have.length(1);
          expect(button.prop('disabled')).to.be.true;
        });
      });
    });

    describe('if order has been made', () => {
      const orderItems = [
        { id: 'cmi-1', name: { fi: 'Kahvi' }, price: 1, quantity: 2 },
      ];
      function getOrderMadeWrapper(props) {
        return getWrapper({ orderItems, ...props });
      }

      it('renders CateringOrderTable with correct data', () => {
        const cateringOrderTable = getOrderMadeWrapper().find(CateringOrderTable);
        expect(cateringOrderTable).to.have.length(1);
        expect(cateringOrderTable.prop('items')).to.deep.equal(orderItems);
      });

      it('renders Button for opening modal with text "Muokkaa tarjoiluja"', () => {
        const wrapper = getOrderMadeWrapper();
        const button = wrapper.find(Button);
        expect(button).to.have.length(1);
        expect(button.prop('children')).to.equal('Muokkaa tarjoiluja');
        expect(button.prop('onClick')).to.equal(wrapper.instance().openCateringModal);
      });

      it('renders correct text if servingTime is not empty', () => {
        const paragraph = getOrderMadeWrapper({ servingTime: '09:11:00' }).find('p');
        expect(paragraph.text()).to.equal('Tilatut tuotteet tarjoillaan klo 9:11.');
      });

      it('renders correct text if servingTime is empty', () => {
        const paragraph = getOrderMadeWrapper({ servingTime: '' }).find('p');
        expect(paragraph.text()).to.equal('Tilatut tuotteet tarjoillaan varauksen alkaessa.');
      });
    });

    it('renders CateringModal with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const cateringModal = wrapper.find(CateringModal);
      expect(cateringModal).to.have.length(1);
      expect(cateringModal.prop('onClose')).to.equal(instance.closeCateringModal);
      expect(cateringModal.prop('onSubmit')).to.equal(instance.handleSubmit);
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

  describe('handleSubmit', () => {
    it('calls onChange with catering order data', () => {
      const onChange = simple.mock();
      const props = { controlProps: { onChange } };
      const instance = getWrapper(props).instance();
      const cateringOrder = { some: 'data' };
      instance.handleSubmit(cateringOrder);
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.arg).to.deep.equal(cateringOrder);
    });

    it('closes modal', () => {
      const instance = getWrapper().instance();
      instance.state.showCateringModal = true;
      instance.handleSubmit();
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
