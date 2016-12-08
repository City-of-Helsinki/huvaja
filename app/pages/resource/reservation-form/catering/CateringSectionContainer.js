import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CateringModal from './CateringModal';
import CateringOrderTable from './CateringOrderTable';
import cateringUtils from './utils';

export const selector = createSelector(
  state => state.catering,
  state => state.data.cateringMenuItems,
  (cateringData, cateringMenuItems) => {
    const orderItems = cateringUtils.getOrderItems(cateringMenuItems, cateringData.order);
    return {
      cateringTime: cateringData.time,
      orderItems,
    };
  }
);

export class UnconnectedCateringSectionContainer extends Component {
  static propTypes = {
    cateringTime: PropTypes.string.isRequired,
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

  openCateringModal() {
    this.setState({ showCateringModal: true });
  }

  render() {
    const { cateringTime, orderItems } = this.props;
    const orderMade = Boolean(orderItems.length);

    return (
      <div className="catering-section">
        <h3>Tarjoilut</h3>
        {!orderMade &&
          <p>Ei tarjoilua</p>
        }
        {orderMade &&
          <div>
            <p>Tilatut tuotteet tarjoillaan klo {cateringTime}.</p>
            <CateringOrderTable items={orderItems} />
          </div>
        }
        <Button onClick={this.openCateringModal}>
          {orderMade ? 'Muokkaa tarjoiluja' : 'Tilaa tarjoilut'}
        </Button>
        <CateringModal onClose={this.closeCateringModal} show={this.state.showCateringModal} />
      </div>
    );
  }
}

export default connect(selector, null)(UnconnectedCateringSectionContainer);
