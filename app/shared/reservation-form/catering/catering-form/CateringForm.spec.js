import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Field } from 'redux-form';

import CateringOrderTable from 'shared/catering-order-table';
import ReduxFormField from 'shared/form-fields/ReduxFormField';
import { UnconnectedCateringForm, validate } from './CateringForm';
import CateringMenu from './CateringMenu';

describe('shared/reservation-form/catering/catering-form/CateringForm', () => {
  const defaults = {
    addOrRemoveItem: () => null,
    cateringMenu: [{ id: 'c1', name: 'Drinks', products: [] }],
    formValues: {
      invoicingData: '12345',
      message: 'Hola!',
      order: {
        2: 10,
      },
      servingTime: '15:45',
    },
    handleCancel: () => null,
    handleSubmit: () => null,
    initialized: true,
    orderItems: [{ some: 'data' }],
    priceListUrl: 'http://example.com/price-list-url',
    updateOrder: () => null,
  };
  function getWrapper(props) {
    return shallow(<UnconnectedCateringForm {...defaults} {...props} />);
  }

  it('renders a form.catering-form when form is initialized', () => {
    const form = getWrapper().find('form.catering-form');
    expect(form).to.have.length(1);
    expect(form.prop('onSubmit')).to.equal(defaults.handleSubmit);
  });

  it('renders only an empty div when form not initialized', () => {
    const wrapper = getWrapper({ initialized: false });
    expect(wrapper.html()).to.equal('<div></div>');
  });

  describe('form fields', () => {
    let fields;

    beforeEach(() => {
      fields = getWrapper().find(Field);
    });

    it('has servingTime field', () => {
      const field = fields.filter({
        component: ReduxFormField,
        controlProps: {
          value: defaults.formValues.servingTime,
        },
        label: 'Tarjoiluaika',
        name: 'servingTime',
        type: 'servingTime',
      });
      expect(field).to.have.length(1);
    });

    it('has invoicingData field', () => {
      const field = fields.filter({
        component: ReduxFormField,
        controlProps: {
          value: defaults.formValues.invoicingData,
        },
        label: 'Projektinumero (laskutustieto)*',
        name: 'invoicingData',
        type: 'text',
      });
      expect(field).to.have.length(1);
    });

    it('has message field', () => {
      const field = fields.filter({
        component: ReduxFormField,
        controlProps: {
          rows: 7,
          value: defaults.formValues.message,
        },
        label: 'Lisätietoja tarjoilun toimittajalle',
        name: 'message',
        type: 'textarea',
      });
      expect(field).to.have.length(1);
    });
  });

  it('does not render pricing link when no url', () => {
    const props = { priceListUrl: null };
    const link = getWrapper(props).find('.pricing-link');
    expect(link).to.have.length(0);
  });

  it('renders pricing link with catering provider link', () => {
    const link = getWrapper().find('.pricing-link');
    expect(link).to.have.length(1);
    expect(link.prop('href')).to.equal(defaults.priceListUrl);
  });

  it('renders CateringMenu component with correct props', () => {
    const component = getWrapper().find(CateringMenu);
    expect(component).to.have.length(1);
    expect(component.prop('onItemClick')).to.equal(defaults.addOrRemoveItem);
    expect(component.prop('order')).to.deep.equal(defaults.formValues.order);
    expect(component.prop('categories')).to.equal(defaults.cateringMenu);
  });

  it('renders CateringOrderTable component with correct props', () => {
    const wrapper = getWrapper();
    const component = wrapper.find(CateringOrderTable);
    expect(component).to.have.length(1);
    expect(component.prop('items')).to.deep.equal(defaults.orderItems);
    expect(component.prop('editOrder')).to.equal(defaults.updateOrder);
    expect(wrapper.contains('Ei tilausta')).to.be.false;
  });

  it('does not render CateringOrderTable when no orderItems', () => {
    const wrapper = getWrapper({ orderItems: [] });
    const component = wrapper.find(CateringOrderTable);
    expect(component).to.have.length(0);
    expect(wrapper.contains('Ei tilausta')).to.be.true;
  });

  it('renders a cancel button with correct onClick handler', () => {
    const wrapper = getWrapper();
    const button = wrapper.find('.cancel-button');
    expect(button).to.have.length(1);
    expect(button.prop('onClick')).to.equal(defaults.handleCancel);
  });

  it('renders a save button', () => {
    const wrapper = getWrapper();
    const saveButton = wrapper.find('.save-button');
    expect(saveButton).to.have.length(1);
  });

  describe('validation', () => {
    const defaultValues = {
      invoicingData: 'abc123',
      order: {
        2: 10,
      },
    };

    function getErrors(extraValues) {
      return validate({ ...defaultValues, ...extraValues });
    }

    describe('when no orders', () => {
      it('has no errors', () => {
        const actual = getErrors({
          order: {},
          servingTime: 'invalid',
        });
        expect(actual).to.deep.equal({});
      });
    });

    describe('invoicingData', () => {
      it('has error when missing', () => {
        const actual = getErrors({ invoicingData: '' }).invoicingData;
        expect(actual).to.deep.equal('Pakollinen tieto');
      });
    });

    describe('servingTime', () => {
      it('has error when invalid servingTime', () => {
        const actual = getErrors({ servingTime: '12:--' }).servingTime;
        expect(actual).to.deep.equal('Aika ei kelpaa.');
      });

      it('no error when valid servingTime', () => {
        const actual = getErrors({ servingTime: '12:30' }).servingTime;
        expect(actual).to.be.undefined;
      });
    });
  });
});
