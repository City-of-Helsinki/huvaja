import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';

import { fetchCateringOrder, fetchReservation } from 'api/actions';
import { ReservationEditForm } from 'shared/reservation-form';
import selector from './ReservationEditPageSelector';

export class UnconnectedReservationEditPageContainer extends Component {
  static propTypes = {
    cateringOrder: PropTypes.object,
    fetchCateringOrder: PropTypes.func.isRequired,
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

  componentWillReceiveProps(nextProps) {
    const shouldFetchCateringOrder = (
      nextProps.reservation &&
      nextProps.reservation.hasCateringOrder &&
      !(this.props.reservation && this.props.reservation.hasCateringOrder)
    );
    if (shouldFetchCateringOrder) {
      this.props.fetchCateringOrder(nextProps.reservation.id);
    }
  }

  renderContent() {
    const { cateringOrder, reservation, resource } = this.props;
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
        cateringOrder={cateringOrder}
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
  fetchCateringOrder,
};

export default connect(selector, actions)(UnconnectedReservationEditPageContainer);
