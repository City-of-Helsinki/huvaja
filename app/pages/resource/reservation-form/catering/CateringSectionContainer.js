import React, { Component, PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import CateringModal from './CateringModal';

export const selector = createSelector(
  state => state.order || [],
  order => ({ order })
);

class CateringSectionContainer extends Component {
  static propTypes = {
    order: PropTypes.array.isRequired,
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
    const { order } = this.props;
    return (
      <div className="catering-section">
        <h3>Tarjoilut</h3>
        <Button onClick={this.openCateringModal}>
          {order.length ? 'Muokkaa tarjoiluja' : 'Tilaa tarjoilut'}
        </Button>
        <CateringModal onClose={this.closeCateringModal} show={this.state.showCateringModal} />
      </div>
    );
  }
}

export default connect(selector, null)(CateringSectionContainer);
