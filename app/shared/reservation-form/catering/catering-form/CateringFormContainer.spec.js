import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import simple from 'simple-mock';

import { UnconnectedCateringFormContainer as CateringFormContainer } from './CateringFormContainer';
import CateringMenu from './CateringMenu';
import CateringOrderTable from '../CateringOrderTable';

describe('shared/reservation-form/catering/catering-form/CateringFormContainer', () => {
  function getCateringData(data) {
    const defaults = {
      additionalInfo: 'Some info',
      order: { 1: 2 },
      projectNumber: 'abc123',
      time: '10:30',
    };
    return { ...defaults, ...data };
  }

  function getWrapper(props) {
    const defaults = {
      cateringData: getCateringData(),
      cateringMenu: [{ id: 'c1', name: 'Drinks', products: [] }],
      cateringMenuItems: { 1: { id: 1, name: 'Coffee' } },
      defaultCateringTime: '12:00',
      defaultItemQuantity: 1,
      saveCateringData: () => null,
    };
    return shallow(<CateringFormContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders a div.catering-form', () => {
      const div = getWrapper().find('div.catering-form');
      expect(div).to.have.length(1);
    });

    describe('time control', () => {
      function getTimeControlWrapper(props) {
        return getWrapper(props).find('[controlId="time-control"]');
      }

      it('has correct label', () => {
        const controlLabel = getTimeControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Tarjoiluaika');
      });

      it('has correct initial value', () => {
        const time = '16:45';
        const cateringData = getCateringData({ time });
        const control = getTimeControlWrapper({ cateringData }).find(FormControl);
        expect(control.prop('value')).to.equal(time);
      });
    });

    describe('projectNumber control', () => {
      function getProjectNumberControlWrapper(props) {
        return getWrapper(props).find('[controlId="project-number-control"]');
      }

      it('has correct label', () => {
        const controlLabel = getProjectNumberControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Projektinumero (laskutustieto)');
      });

      it('has correct initial value', () => {
        const cateringData = getCateringData({ projectNumber: 'abc123' });
        const control = getProjectNumberControlWrapper({ cateringData }).find(FormControl);
        expect(control.prop('value')).to.equal(cateringData.projectNumber);
      });
    });

    describe('additionalInfo control', () => {
      function getProjectNumberControlWrapper(props) {
        return getWrapper(props).find('[controlId="additional-info-control"]');
      }

      it('has correct label', () => {
        const controlLabel = getProjectNumberControlWrapper().find(ControlLabel);
        expect(controlLabel.prop('children')).to.equal('Viesti tarjoilun toimittajalle');
      });

      it('has correct initial value', () => {
        const cateringData = getCateringData({ additionalInfo: 'some info' });
        const control = getProjectNumberControlWrapper({ cateringData }).find(FormControl);
        expect(control.prop('value')).to.equal(cateringData.additionalInfo);
      });
    });

    it('renders CateringMenu component with correct props', () => {
      const cateringMenu = [{ id: 'c1', name: 'Donuts', products: [] }];
      const order = { foo: 'bar' };
      const wrapper = getWrapper({ cateringData: getCateringData({ order }), cateringMenu });
      const component = wrapper.find(CateringMenu);
      expect(component).to.have.length(1);
      expect(component.prop('onItemClick')).to.equal(wrapper.instance().addOrRemoveItem);
      expect(component.prop('order')).to.deep.equal(order);
      expect(component.prop('categories')).to.equal(cateringMenu);
    });

    it('renders CateringOrderTable component with correct props', () => {
      const wrapper = getWrapper();
      const component = wrapper.find(CateringOrderTable);
      expect(component).to.have.length(1);
      expect(component.prop('items')).to.exist;
      expect(component.prop('editOrder')).to.equal(wrapper.instance().updateOrder);
    });

    it('renders a save button with correct onClick handler', () => {
      const wrapper = getWrapper();
      const saveButton = wrapper.find('.save-button');
      expect(saveButton).to.have.length(1);
      expect(saveButton.prop('onClick')).to.equal(wrapper.instance().handleSubmit);
    });

    it('renders a cancel button with correct onClick handler', () => {
      const wrapper = getWrapper();
      const saveButton = wrapper.find('.cancel-button');
      expect(saveButton).to.have.length(1);
      expect(saveButton.prop('onClick')).to.equal(wrapper.instance().handleCancel);
    });
  });

  describe('componentWillReceiveProps', () => {
    describe('when cateringData prop changes', () => {
      const initialCateringData = {
        additionalInfo: 'some info',
        order: { foo: 'bar' },
        projectNumber: 'abc123',
        time: '11:00',
      };
      const changeCateringData = {
        additionalInfo: 'new info',
        order: { foo: 'new bar' },
        projectNumber: 'new123',
        time: '19:30',
      };
      const nextProps = { cateringData: changeCateringData };

      it('changes state to the new cateringData', () => {
        const instance = getWrapper({ cateringData: initialCateringData }).instance();
        const setStateMock = simple.mock(instance, 'setState');
        instance.state = initialCateringData;
        instance.componentWillReceiveProps(nextProps);
        expect(setStateMock.callCount).to.equal(1);
        expect(setStateMock.lastCall.arg).to.deep.equal(changeCateringData);
        simple.restore();
      });
    });

    describe('when cateringData prop does not change', () => {
      const cateringData = {
        additionalInfo: 'some info',
        order: { foo: 'bar' },
        projectNumber: 'abc123',
        time: '11:00',
      };
      const nextProps = { cateringData };

      it('does not change state', () => {
        const instance = getWrapper({ cateringData }).instance();
        const setStateMock = simple.mock(instance, 'setState');
        instance.state = cateringData;
        instance.componentWillReceiveProps(nextProps);
        expect(setStateMock.callCount).to.equal(0);
        simple.restore();
      });
    });
  });

  describe('handleCancel', () => {
    it('calls props.saveCateringData with empty object', () => {
      const saveCateringData = simple.mock();
      const instance = getWrapper({ saveCateringData }).instance();
      instance.handleCancel();
      expect(saveCateringData.callCount).to.equal(1);
      expect(saveCateringData.lastCall.arg).to.deep.equal({});
    });

    it('calls props.onCancelCallback', () => {
      const onCancelCallback = simple.mock();
      const instance = getWrapper({ onCancelCallback }).instance();
      instance.handleCancel();
      expect(onCancelCallback.callCount).to.equal(1);
    });
  });

  describe('handleSubmit', () => {
    it('calls props.saveCateringData with data in state', () => {
      const saveCateringData = simple.mock();
      const instance = getWrapper({ saveCateringData }).instance();
      const state = { foo: 'bar' };
      instance.state = state;
      instance.handleSubmit();
      expect(saveCateringData.callCount).to.equal(1);
      expect(saveCateringData.lastCall.arg).to.deep.equal(state);
    });

    it('calls props.onSubmitCallback', () => {
      const onSubmitCallback = simple.mock();
      const instance = getWrapper({ onSubmitCallback }).instance();
      instance.handleSubmit();
      expect(onSubmitCallback.callCount).to.equal(1);
    });
  });

  describe('addOrRemoveItem', () => {
    it('sets item quantity to 0 if it exists in state.order', () => {
      const instance = getWrapper().instance();
      const state = { order: { 'item-1': 5 } };
      instance.state = state;
      instance.addOrRemoveItem('item-1');
      expect(instance.state.order['item-1']).to.equal(0);
    });

    it('sets item quantity to default quantity if it does not exist in state.order', () => {
      const defaultItemQuantity = 12;
      const instance = getWrapper({ defaultItemQuantity }).instance();
      const state = { order: {} };
      instance.state = state;
      instance.addOrRemoveItem('item-1');
      expect(instance.state.order['item-1']).to.equal(defaultItemQuantity);
    });
  });

  describe('updateOrder', () => {
    it('sets item quantity to given quantity in state.order', () => {
      const instance = getWrapper().instance();
      instance.updateOrder('item-1', 7);
      expect(instance.state.order['item-1']).to.equal(7);
    });

    it('does not affect other items in state', () => {
      const instance = getWrapper().instance();
      const state = { order: { 'item-2': 5 } };
      instance.state = state;
      instance.updateOrder('item-1', 7);
      expect(instance.state.order['item-2']).to.equal(5);
    });
  });
});
