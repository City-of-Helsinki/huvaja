import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { fetchReservation } from 'api/actions';
import { ReservationEditForm } from 'shared/reservation-form';
import selector from './ReservationEditPageSelector';

export class UnconnectedReservationEditPageContainer extends Component {
  static propTypes = {
    fetchReservation: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object,
  }

  componentDidMount() {
    this.props.fetchReservation(this.props.params.id);
  }

  render() {
    return (
      <div>
        <h1>Varauksen muokkaus</h1>
        <Loader loaded={Boolean(this.props.reservation && this.props.resource)}>
          <ReservationEditForm
            reservation={this.props.reservation}
            resource={this.props.resource}
          />
        </Loader>
      </div>
    );
  }
}

const actions = {
  fetchReservation,
};

export default connect(selector, actions)(UnconnectedReservationEditPageContainer);
