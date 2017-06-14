import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CateringOrderTable from 'shared/catering-order-table';
import CateringModal from './CateringModal';
import cateringUtils from './utils';

function cateringOrderSelector(state) {
  return state.form.resourceReservation.values.cateringOrder;
}

function cateringProductsSelector(state) {
  return state.data.cateringProducts;
}

const cateringProductsMissingSelector = createSelector(
  cateringOrderSelector,
  cateringProductsSelector,
  (cateringOrder, products) => {
    if (!cateringOrder) return false;
    const productIds = Object.keys(cateringOrder.order);
    for (const productId of productIds) {
      if (!products[productId]) return true;
    }
    return false;
  }
);

export const selector = createSelector(
  cateringOrderSelector,
  cateringProductsSelector,
  cateringProductsMissingSelector,
  (cateringData, cateringMenuItems, productsMissing) => {
    const orderItems = productsMissing ? [] :
      cateringUtils.getOrderItems(
        cateringMenuItems,
        cateringData ? cateringData.order : {}
      );
    return {
      servingTime: cateringData && cateringData.servingTime ? cateringData.servingTime : '',
      orderItems,
    };
  }
);

export class UnconnectedCateringSectionContainer extends Component {
  static propTypes = {
    servingTime: PropTypes.string,
    controlProps: PropTypes.shape({
      onChange: PropTypes.func.isRequired,
    }).isRequired,
    orderItems: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.closeCateringModal = this.closeCateringModal.bind(this);
    this.openCateringModal = this.openCateringModal.bind(this);
    this.state = {
      showCateringModal: false,
    };
  }

  closeCateringModal() {
    this.setState({ showCateringModal: false });
  }

  handleSubmit = (cateringOrder) => {
    this.props.controlProps.onChange(cateringOrder);
    this.closeCateringModal();
  }

  openCateringModal() {
    this.setState({ showCateringModal: true });
  }

  render() {
    const { servingTime, orderItems } = this.props;
    const orderMade = Boolean(orderItems.length);

    return (
      <div className="catering-section">
        <h3>Tarjoilut</h3>
        {!orderMade &&
          <p>Ei tarjoilua</p>
        }
        {orderMade &&
          <div>
            {servingTime ?
              <p>Tilatut tuotteet tarjoillaan klo {servingTime}.</p> :
              <p>Tilatut tuotteet tarjoillaan varauksen alkaessa.</p>
            }
            <CateringOrderTable items={orderItems} />
          </div>
        }
        <Button onClick={this.openCateringModal}>
          {orderMade ? 'Muokkaa tarjoiluja' : 'Tilaa tarjoilut'}
        </Button>
        <CateringModal
          onClose={this.closeCateringModal}
          onSubmit={this.handleSubmit}
          show={this.state.showCateringModal}
        />
      </div>
    );
  }
}

export default connect(selector, null)(UnconnectedCateringSectionContainer);
