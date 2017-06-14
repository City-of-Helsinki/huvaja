import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CateringOrderTable from 'shared/catering-order-table';
import CateringModal from './CateringModal';
import cateringUtils from './utils';

export const selector = createSelector(
  state => state.form.resourceReservation.values.cateringOrder,
  state => state.data.cateringProducts,
  (cateringData, cateringMenuItems) => {
    const orderItems = cateringUtils.getOrderItems(
      cateringMenuItems,
      cateringData ? cateringData.order : {}
    );
    return {
      servingTime: cateringData ? cateringData.servingTime : '',
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
            <p>Tilatut tuotteet tarjoillaan klo {servingTime}.</p>
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
