import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { change } from 'redux-form';

import selector from './cateringFormSelector';
import CateringForm from './CateringForm';
import cateringUtils from '../utils';

export class UnconnectedCateringFormContainer extends Component {
  static propTypes = {
    cateringMenu: PropTypes.array.isRequired,
    cateringMenuItems: PropTypes.object.isRequired,
    cateringProvider: PropTypes.shape({
      priceListUrl: PropTypes.object,
    }).isRequired,
    change: PropTypes.func.isRequired,
    defaultItemQuantity: PropTypes.number.isRequired,
    formValues: PropTypes.object,
    initialValues: PropTypes.object.isRequired,
    onCancelCallback: PropTypes.func,
    onSubmitCallback: PropTypes.func.isRequired,
  }

  handleCancel = () => {
    this.props.onCancelCallback && this.props.onCancelCallback();
  }

  handleSubmit = () => {
    const servingTime = this.props.formValues.servingTime;
    this.props.onSubmitCallback({
      ...this.props.formValues,
      servingTime: servingTime === '' ? null : servingTime,
    });
  }

  addOrRemoveItem = (itemId) => {
    if (this.props.formValues.order[itemId]) {
      this.updateOrder(itemId, 0);
    } else {
      this.updateOrder(itemId, this.props.defaultItemQuantity);
    }
  }

  updateOrder = (itemId, quantity = 1) => {
    const order = { ...this.props.formValues.order, [itemId]: quantity };
    this.props.change(
      'catering',
      'order',
      order
    );
  }

  render() {
    const orderItems = cateringUtils.getOrderItems(
      this.props.cateringMenuItems,
      this.props.formValues.order || {}
    );
    const priceListUrl = (
      this.props.cateringProvider.priceListUrl &&
      this.props.cateringProvider.priceListUrl.fi
    );
    return (
      <CateringForm
        addOrRemoveItem={this.addOrRemoveItem}
        cateringMenu={this.props.cateringMenu}
        handleCancel={this.handleCancel}
        initialValues={this.props.initialValues}
        onSubmit={this.handleSubmit}
        orderItems={orderItems}
        priceListUrl={priceListUrl}
        updateOrder={this.updateOrder}
        formValues={this.props.formValues}
      />
    );
  }
}

const actions = {
  change,
};

export default connect(selector, actions)(UnconnectedCateringFormContainer);
