import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import CateringForm from './CateringForm';
import { UnconnectedCateringFormContainer as CateringFormContainer } from './CateringFormContainer';

describe('shared/reservation-form/catering/catering-form/CateringFormContainer', () => {
  const formValues = {
    invoicingData: 'abc123',
    message: 'Some info',
    order: { 1: 2 },
    servingTime: '10:30',
  };
  const initialValues = {
    invoicingData: '',
    message: '',
    order: {},
    servingTime: '10:00',
  };
  const defaults = {
    cateringMenu: [{ id: 'c1', name: 'Drinks', products: [] }],
    cateringMenuItems: { 1: { id: 1, name: 'Coffee' } },
    cateringProvider: { priceListUrl: { fi: 'http://www.example.org' } },
    change: () => null,
    defaultItemQuantity: 1,
    formValues,
    initialValues,
    onCancelCallback: () => null,
    onSubmitCallback: () => null,
  };

  function getWrapper(props) {
    return shallow(<CateringFormContainer {...defaults} {...props} />);
  }

  describe('render', () => {
    it('renders CateringForm with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      expect(wrapper.is(CateringForm)).to.be.true;
      expect(wrapper.prop('addOrRemoveItem')).to.equal(instance.addOrRemoveItem);
      expect(wrapper.prop('cateringMenu')).to.deep.equal(defaults.cateringMenu);
      expect(wrapper.prop('handleCancel')).to.equal(instance.handleCancel);
      expect(wrapper.prop('initialValues')).to.deep.equal(defaults.initialValues);
      expect(wrapper.prop('onSubmit')).to.equal(instance.handleSubmit);
      expect(wrapper.prop('orderItems')).to.deep.equal([{
        id: 1,
        name: 'Coffee',
        quantity: 2,
      }]);
      expect(wrapper.prop('priceListUrl')).to.equal(defaults.cateringProvider.priceListUrl.fi);
      expect(wrapper.prop('updateOrder')).to.equal(instance.updateOrder);
      expect(wrapper.prop('formValues')).to.deep.equal(defaults.formValues);
    });
  });

  describe('handleCancel', () => {
    it('calls onCancelCallback', () => {
      const onCancelCallback = simple.mock();
      const instance = getWrapper({ onCancelCallback }).instance();
      instance.handleCancel();
      expect(onCancelCallback.callCount).to.equal(1);
    });
  });

  describe('handleSubmit', () => {
    it('calls onSubmitCallback with form values', () => {
      const onSubmitCallback = simple.mock();
      const instance = getWrapper({ onSubmitCallback }).instance();
      instance.handleSubmit();
      expect(onSubmitCallback.callCount).to.equal(1);
      expect(onSubmitCallback.lastCall.arg).to.deep.equal(formValues);
    });

    it('sets servingTime to null if it is an empty string', () => {
      const onSubmitCallback = simple.mock();
      const formValues = {
        foo: 'bar',
        servingTime: '',
      };
      const instance = getWrapper({ formValues, onSubmitCallback }).instance();
      instance.handleSubmit();
      expect(onSubmitCallback.lastCall.arg[0]).to.equal({
        foo: 'bar',
        servingTime: null,
      });
    });
  });

  describe('updateOrder', () => {
    it('calls change with updated order data', () => {
      const change = simple.mock();
      const instance = getWrapper({ change }).instance();
      instance.updateOrder(5, 6);
      expect(change.callCount).to.equal(1);
      expect(change.lastCall.args).to.deep.equal([
        'catering',
        'order',
        {
          ...formValues.order,
          5: 6,
        },
      ]);
    });
  });

  describe('addOrRemoveItem', () => {
    it('sets quantity to zero if item existed', () => {
      const change = simple.mock();
      const instance = getWrapper({ change }).instance();
      instance.addOrRemoveItem(1);
      expect(change.callCount).to.equal(1);
      expect(change.lastCall.args).to.deep.equal([
        'catering',
        'order',
        { 1: 0 },
      ]);
    });

    it('sets default quantity if item did not exist', () => {
      const change = simple.mock();
      const instance = getWrapper({ change }).instance();
      instance.addOrRemoveItem(5);
      expect(change.callCount).to.equal(1);
      expect(change.lastCall.args).to.deep.equal([
        'catering',
        'order',
        {
          ...formValues.order,
          5: defaults.defaultItemQuantity,
        },
      ]);
    });
  });
});
