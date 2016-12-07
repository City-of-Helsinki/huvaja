import omit from 'lodash/omit';
import values from 'lodash/values';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import uiActions from 'actions/uiActions';
import CateringMenuItems from './CateringMenuItems';
import CateringOrderTable from '../CateringOrderTable';
import cateringUtils from '../utils';

export const selector = createSelector(
  state => state.data.cateringMenuItems || {},
  cateringMenuItems => ({ cateringMenuItems })
);

class CateringFormContainer extends Component {
  static propTypes = {
    cateringMenuItems: PropTypes.object.isRequired,
    onCancelCallback: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    saveCateringData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.state = {
      order: {},
    };
  }

  handleCancel() {
    this.props.onCancelCallback && this.props.onCancelCallback();
  }

  handleSubmit() {
    this.props.saveCateringData(this.state);
    this.props.onSubmitCallback && this.props.onSubmitCallback();
  }

  updateOrder(itemId) {
    if (this.state.order[itemId]) {
      this.setState({
        order: omit(this.state.order, itemId),
      });
    } else {
      this.setState({
        order: { ...this.state.order, [itemId]: 1 },
      });
    }
  }

  render() {
    const orderItems = cateringUtils.getOrderItems(this.props.cateringMenuItems, this.state.order);
    return (
      <div className="catering-form">
        <Row>
          <Col xs={12} sm={6} md={6}>
            <p>Päivä</p>
            <p>Aika</p>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <h3>Tarjoiluvaihtoehdot</h3>
            <p>
              Poimi haluamasi Tarjoiluvaihtoehdot.
              Alempana kohdassa tilaus pääset muokkaamaan valittujen tuotteiden kappalemääriä.
            </p>
            <CateringMenuItems
              items={values(this.props.cateringMenuItems)}
              onItemClick={this.updateOrder}
              order={this.state.order}
            />
          </Col>
        </Row>
        <h3>Tilaus</h3>
        <CateringOrderTable items={orderItems} />
        <div className="controls">
          <Button
            bsStyle="primary"
            className="save-button"
            onClick={this.handleSubmit}
          >
            Tallenna tilaus
          </Button>
          <Button
            className="cancel-button"
            onClick={this.handleCancel}
          >
            Peruuta tilaus
          </Button>
        </div>
      </div>
    );
  }
}

const actions = {
  saveCateringData: uiActions.saveCateringData,
};

export default connect(selector, actions)(CateringFormContainer);
