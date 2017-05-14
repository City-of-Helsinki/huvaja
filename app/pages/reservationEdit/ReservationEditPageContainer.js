import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { fetchReservation } from 'api/actions';
import { ReservationEditForm } from 'shared/reservation-form';
import selector from './ReservationEditPageSelector';

export class UnconnectedReservationEditPageContainer extends Component {
  static propTypes = {
    fetchReservation: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object,
  }

  componentDidMount() {
    this.props.fetchReservation(this.props.params.id);
  }

  renderContent() {
    const { reservation, resource } = this.props;
    if (!reservation) {
      return (
        <div className="message">Varausta ei löytynyt.</div>
      );
    }
    if (!reservation.userPermissions.canModify) {
      return (
        <div className="message">
          Sinulla ei ole oikeutta muokata tätä varausta.
        </div>
      );
    }
    return (
      <ReservationEditForm
        reservation={reservation}
        initialResource={resource}
      />
    );
  }

  render() {
    return (
      <div>
        <h1>Varauksen muokkaus</h1>
        <Loader loaded={!this.props.isFetching}>
          {this.renderContent(this.props)}
        </Loader>
      </div>
    );
  }
}

const actions = {
  fetchReservation,
};

export default connect(selector, actions)(UnconnectedReservationEditPageContainer);
