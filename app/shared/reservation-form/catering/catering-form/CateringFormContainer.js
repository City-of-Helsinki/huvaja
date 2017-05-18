import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Row from 'react-bootstrap/lib/Row';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import uiActions from 'actions/uiActions';
import selector from './cateringFormSelector';
import CateringMenu from './CateringMenu';
import CateringOrderTable from '../CateringOrderTable';
import cateringUtils from '../utils';

export class UnconnectedCateringFormContainer extends Component {
  static propTypes = {
    cateringData: PropTypes.shape({
      additionalInfo: PropTypes.string.isRequired,
      order: PropTypes.object.isRequired,
      projectNumber: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    }).isRequired,
    cateringMenu: PropTypes.array.isRequired,
    cateringMenuItems: PropTypes.object.isRequired,
    defaultCateringTime: PropTypes.string.isRequired,
    defaultItemQuantity: PropTypes.number.isRequired,
    onCancelCallback: PropTypes.func,
    onSubmitCallback: PropTypes.func,
    saveCateringData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addOrRemoveItem = this.addOrRemoveItem.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.state = {
      additionalInfo: props.cateringData.additionalInfo,
      order: props.cateringData.order,
      projectNumber: props.cateringData.projectNumber,
      time: props.cateringData.time || props.defaultCateringTime,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.cateringData, nextProps.cateringData)) {
      this.setState({
        additionalInfo: nextProps.cateringData.additionalInfo,
        order: nextProps.cateringData.order,
        projectNumber: nextProps.cateringData.projectNumber,
        time: nextProps.cateringData.time || nextProps.defaultCateringTime,
      });
    }
  }

  handleCancel() {
    this.props.saveCateringData({});
    this.props.onCancelCallback && this.props.onCancelCallback();
  }

  handleSubmit() {
    this.props.saveCateringData(this.state);
    this.props.onSubmitCallback && this.props.onSubmitCallback();
  }

  addOrRemoveItem(itemId) {
    if (this.state.order[itemId]) {
      this.updateOrder(itemId, 0);
    } else {
      this.updateOrder(itemId, this.props.defaultItemQuantity);
    }
  }

  updateOrder(itemId, quantity = 1) {
    this.setState({
      order: { ...this.state.order, [itemId]: quantity },
    });
  }

  render() {
    const orderItems = cateringUtils.getOrderItems(this.props.cateringMenuItems, this.state.order);
    return (
      <div className="catering-form">
        <Row>
          <Col xs={12} sm={6} md={6}>
            <FormGroup controlId="time-control">
              <ControlLabel>Tarjoiluaika</ControlLabel>
              <InputGroup>
                <InputGroup.Addon>
                  <FontAwesome name="clock-o" />
                </InputGroup.Addon>
                <FormControl
                  onChange={event => this.setState({ time: event.target.value })}
                  step={5 * 60}
                  type="time"
                  value={this.state.time}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup controlId="project-number-control">
              <ControlLabel>Projektinumero (laskutustieto)</ControlLabel>
              <FormControl
                onChange={event => this.setState({ projectNumber: event.target.value })}
                type="text"
                value={this.state.projectNumber}
              />
            </FormGroup>
            <FormGroup controlId="additional-info-control">
              <ControlLabel>Viesti tarjoilun toimittajalle</ControlLabel>
              <FormControl
                componentClass="textarea"
                onChange={event => this.setState({ additionalInfo: event.target.value })}
                rows="7"
                value={this.state.additionalInfo}
              />
            </FormGroup>
          </Col>
          <Col xs={12} sm={6} md={6}>
            <h3>Tarjoiluvaihtoehdot</h3>
            <p>
              Poimi haluamasi Tarjoiluvaihtoehdot.
              Alempana kohdassa tilaus pääset muokkaamaan valittujen tuotteiden kappalemääriä.
            </p>
            <a
              className="pricing-link"
              href="http://example.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Hinnasto
            </a>
            <CateringMenu
              categories={this.props.cateringMenu}
              onItemClick={this.addOrRemoveItem}
              order={this.state.order}
            />
          </Col>
        </Row>
        <h3>Tilaus</h3>
        {orderItems.length
          ? <CateringOrderTable editOrder={this.updateOrder} items={orderItems} />
          : <div>Ei tilausta</div>
        }
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

export default connect(selector, actions)(UnconnectedCateringFormContainer);
